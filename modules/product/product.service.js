const { buildQuery } = require("../../lib/filter");
const {
  filterMedia,
  calculateProductFinalPrice,
} = require("../../lib/general");
const throwError = require("../../middlewares/throw-error");
const Product = require("../../models/Product");

const productService = {
  async exists(filter) {
    return await Product.findOne(filter)
      .populate("media tags colors brand sizes relatedProducts categories")
      .lean();
  },

  async create(data) {
    const translation = data.translations.find((item) => item.lang === "us");
    const existing = await this.exists({
      "translations.slug": translation.slug,
    });

    if (existing) {
      throwError("Product already exists.");
    }

    const product = new Product(data);
    return await product.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Product does not exist.", 404);
    }

    const product = await Product.findByIdAndUpdate(_id, data, { new: true });

    return product;
  },

  async getAll({
    filter,
    search,
    sort,
    page = 1,
    page_size = 10,
    lang = null,
  }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "translations.name",
        "translations.slug",
        "translations.excerpt",
        "translations.description",
        "brand.translations.name",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [products, total] = await Promise.all([
      Product.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Product.countDocuments(criteria),
    ]);

    if (lang) {
      products = products.map((b) => {
        const translation = b.translations.find((t) => t.lang === lang) || {};
        return {
          ...b,
          ...translation,
          translations: undefined,
          _id: b._id,
        };
      });
    }

    return { products, total };
  },

  async getDetails(filter, lang = null) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("Product does not exist.", 404);
    }

    let product = await Product.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
      .populate({
        path: "tags",
        select: "translations",
      })
      .populate({
        path: "colors",
        select: "translations code",
      })
      .populate({
        path: "sizes",
        select: "translations dimensions",
      })
      .populate({
        path: "categories",
        select: "translations",
      })
      .populate({
        path: "brand",
        select: "translations",
      })
      // .populate({
      //   path: "reviews",
      //   select: "user title text rate",
      // })
      .populate({
        path: "relatedProducts",
        select: "translations media colors sizes rate quantity",
      })
      .populate({
        path: "media",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .lean();

    if (!product) {
      throwError("Product does not exist.", 404);
    }

    if (lang) {
      const translation =
        (product.translations || []).find((t) => t.lang === lang) || {};
      product = { ...product, ...translation, translations: undefined };
    }

    if (lang) {
      if (product.tags) {
        product.tags = product.tags.map((tag) => {
          const t =
            (tag.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: tag._id };
        });
      }

      if (product.categories) {
        product.categories = product.categories.map((cat) => {
          const t =
            (cat.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: cat._id };
        });
      }

      if (product.colors) {
        product.colors = product.colors.map((color) => {
          const t =
            (color.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: color._id };
        });
      }

      if (product.sizes) {
        product.sizes = product.sizes.map((size) => {
          const t =
            (size.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, ...size, translations: undefined, _id: size._id };
        });
      }

      if (product.relatedProducts) {
        product.relatedProducts = product.relatedProducts.map((item) => {
          const t =
            (item.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, ...item, translations: undefined, _id: item._id };
        });
      }

      if (product.brand) {
        const t =
          (product.brand.translations || []).find((tr) => tr.lang === lang) ||
          {};
        product.brand = {
          ...t,
          ...product.brand,
          translations: undefined,
        };
      }
    }

    product.media = filterMedia(product.media);

    return product;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Product does not exist.", 404);
    }

    const product = await Product.findByIdAndDelete(_id);

    return product;
  },

  async getByIds(productIds) {
    const products = await Product.find({
      _id: { $in: productIds },
    })
      .select("translations")
      .populate("translations")
      .lean();

    return products;
  },

  async updateProductsInCampaign(products, isInCampaign, translations) {
  for (const product of products) {
    let prodDoc = product;

    prodDoc = await Product.findById(product);
    if (!prodDoc) continue;

    prodDoc.translations = prodDoc.translations.map((tr) => {
      const campaignTr = translations.find((t) => t.lang === tr.lang);

      if (!isInCampaign) {
        return {
          ...(tr.toObject ? tr.toObject() : tr),
          discount: { ...tr.discount, amount: 0 },
          finalPrice: calculateProductFinalPrice(tr.price, { ...tr.discount, amount: 0 }),
        };
      }

      if (campaignTr && campaignTr.discount) {
        return {
          ...(tr.toObject ? tr.toObject() : tr),
          discount: campaignTr.discount,
          finalPrice: calculateProductFinalPrice(tr.price, campaignTr.discount),
        };
      }

      return tr;
    });

    prodDoc.isInCampaign = isInCampaign;

    await prodDoc.save();
  }
}
};

module.exports = { productService };
