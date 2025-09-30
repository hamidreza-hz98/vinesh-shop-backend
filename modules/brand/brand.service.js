const Brand = require("../../models/Brand");
const { buildQuery } = require("../../lib/filter");
const throwError = require("../../middlewares/throw-error");

const brandService = {
  async exists(filter) {
    return await Brand.findOne(filter).populate("image categories tags").lean();
  },

  async create(data) {
    const translation = data.translations.find((item) => item.lang === "us");
    const existing = await this.exists({
      "translations.slug": translation.slug,
    });

    if (existing) {
      throwError("Brand already exists.");
    }

    const brand = new Brand(data);
    return await brand.save();
  },

  async update(_id, data) {
    const existing = await this.exists({_id});

    if (!existing) {
      throwError("Brand does not exist.", 404);
    }

    const brand = await Brand.findByIdAndUpdate(_id, data, { new: true });

    return brand;
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
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [brands, total] = await Promise.all([
      Brand.find(criteria).sort(sortOptions).skip(skip).limit(page_size).lean(),
      Brand.countDocuments(criteria),
    ]);

    if (lang) {
      brands = brands.map((b) => {
        const translation = b.translations.find((t) => t.lang === lang) || {};
        return {
          ...b,
          ...translation,
          translations: undefined,
          _id: b._id,
        };
      });
    }

    return { brands, total };
  },

  async getDetails(filter, lang = null) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("Brand does not exist.", 404);
    }

    let brand = await Brand.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
      .populate({
        path: "tags",
        select: "translations",
      })
      .populate({
        path: "categories",
        select: "translations",
      })
      .populate({
        path: "image",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .lean();

    if (!brand) {
      throwError("Brand does not exist.", 404);
    }

    if (lang) {
      const translation =
        (brand.translations || []).find((t) => t.lang === lang) || {};
      brand = { ...brand, ...translation, translations: undefined };
    }

    if (lang) {
      if (brand.tags) {
        brand.tags = brand.tags.map((tag) => {
          const t =
            (tag.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: tag._id };
        });
      }

      if (brand.categories) {
        brand.categories = brand.categories.map((sub) => {
          const t =
            (sub.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: sub._id };
        });
      }
    }

    const filterMedia = (media) => {
      if (!media) return null;

      const t = (media.translations || []).find((tr) => tr.lang === lang) || {};
      return { ...media, ...t, translations: undefined };
    };

    brand.image = filterMedia(brand.image);
    brand.icon = filterMedia(brand.icon);
    brand.banners = filterMedia(brand.banners);

    return brand;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Brand does not exist.", 404);
    }

    const brand = await Brand.findByIdAndDelete(_id);

    return brand;
  },
};

module.exports = { brandService };
