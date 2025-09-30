const Cart = require("../../models/Cart");
const throwError = require("../../middlewares/throw-error");
const { calculateCartPrice } = require("../../lib/general");
const { productService } = require("../product/product.service");
const { couponService } = require("../coupon/coupon.service");
const { buildQuery } = require("../../lib/filter");

const cartService = {
  async exists(filter) {
    return await Cart.findOne(filter).populate(
      "products user coupon suggestedProducts"
    );
  },

  async create(data) {
    const existing = await this.exists({ user: data.user });

    if (existing) {
      throwError("User already has an active cart.");
    }

    const price = await this.updatePrice(data);

    const cart = new Cart({ ...data, price });
    return await cart.save();
  },

  async update(_id, { action, product, user, lang }) {
    let cart = await Cart.findById(_id);
    if (!cart) {
      return await Cart.create({
        user,
        products: [{ product, quantity: action > 0 ? action : 1 }],
        lang,
      });
    }

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === product.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += action;

      if (existingProduct.quantity <= 0) {
        cart.products = cart.products.filter(
          (p) => p.product.toString() !== product.toString()
        );
      }
    } else {
      cart.products.push({ product, quantity: 1 });
    }

    cart.price = await this.updatePrice({ ...cart.toObject(), lang });

    await cart.save();
    return cart;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: ["user.firstname", "user.lastName", "user.phone"],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [carts, total] = await Promise.all([
      Cart.find(criteria).sort(sortOptions).skip(skip).limit(page_size).lean(),
      Cart.countDocuments(criteria),
    ]);

    return { carts, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Cart not found", 404);
    }

    const cart = await Cart.findByIdAndDelete(_id);

    return cart;
  },

  async updatePrice(data) {
    const productIds = data.products.map((item) => item.product);
    const products = await productService.getByIds(productIds);
    const productsWithQuantity = products.map((item, index) => ({
      ...item,
      quantity: data.products[index].quantity,
    }));

    const coupon = data.coupon
      ? await couponService.getDetails(data.coupon)
      : null;

    return calculateCartPrice(productsWithQuantity, coupon, data.lang);
  },
};

module.exports = { cartService };
