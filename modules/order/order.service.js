const Order = require("../../models/Order");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const orderService = {
  async exists(filter) {
    return await Order.findOne(filter);
  },

  async create(data) {
    const order = new Order(data);

    return await order.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Order not found.", 404);
    }

    const order = await Order.findByIdAndUpdate(_id, data, { new: true });

    return order;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "orderType",
        "trackNumber",
        "status",
        "address.address",
        "address.zipCode",
        "user.firstName",
        "user.lastName",
        "user.phone",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [orders, total] = await Promise.all([
      Order.find(criteria).sort(sortOptions).skip(skip).limit(page_size).lean(),
      Order.countDocuments(criteria),
    ]);

    return { orders, total };
  },

  async getDetails(_id) {
    const order = await this.exists({ _id });
    if (!order) {
      throwError("Order not found.", 404);
    }

    return order;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Order not found.", 404);
    }

    const order = await Order.findByIdAndDelete(_id);

    return order;
  },

  async getUserOrders(
    user,
    { filter, search, sort, page = 1, page_size = 10 }
  ) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "orderType",
        "trackNumber",
        "status",
        "address.name",
        "address.receipientName",
        "address.receipientPhone",
        "address.address",
        "address.zipCode",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [orders, total] = await Promise.all([
      Order.find({ user, ...criteria })
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .populate({
          path: "address",
        })
        .populate({
          path: "transaction",
        })
        .populate({
          path: "cart",
          select: "translations products",
        })
        .populate({
          path: "user",
        }),
      Order.countDocuments(criteria),
    ]);

    return { orders, total };
  },

  async getUserOrderDetails(code, lang) {
    const existing = await this.exists({ trackNumber: code });
    if (!existing) {
      return throwError("Order not found", 404);
    }

    const order = await Order.findOne({ trackNumber: code })
      .populate({
        path: "address",
      })
      .populate({
        path: "transaction",
      })
      .populate({
        path: "cart",
        select: "translations products",
      })
      .populate({
        path: "user",
      })
      .lean();

    if (lang) {
      if (order.cart) {
        const t =
          (order.cart.translations || []).find((tr) => tr.lang === lang) || {};
        order.cart = {
          ...t,
          ...order.cart,
          translations: undefined,
        };
      }
    }

    return order;
  },
};

module.exports = { orderService };
