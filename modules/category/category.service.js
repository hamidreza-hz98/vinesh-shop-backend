const Category = require("../../models/Category");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const categoryService = {
  async exists(filter) {
    return await Category.findOne(filter)
      .populate("tags subCategories image icon banners")
      .lean();
  },

  async create(data) {
    const translation = data.translations.find((item) => item.lang === "us");
    const existing = await this.exists({
      "translations.slug": translation.slug,
    });

    if (existing) {
      throwError("Category already exists.");
    }

    const category = new Category(data);
    return await category.save();
  },

  async update(_id, data) {
    const translation = data.translations.find((item) => item.lang === "us");
    const existing = await this.exists({
      "translations.slug": translation.slug,
    });

    if (!existing) {
      throwError("Category does not exist.", 404);
    }

    const category = await Category.findByIdAndUpdate(_id, data, { new: true });

    return category;
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

    let [categories, total] = await Promise.all([
      Category.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Category.countDocuments(criteria),
    ]);

    if (lang) {
      categories = categories.map((cat) => {
        const translation = cat.translations.find((t) => t.lang === lang) || {};
        return {
          ...cat,
          ...translation,
          translations: undefined,
          _id: cat._id,
        };
      });
    }

    return { categories, total };
  },

  async getDetails(filter, lang = null) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("Category does not exist.", 404);
    }

    let category = await Category.findOneAndUpdate(
      filter,
      { $inc: { visits: 1 } },
      { new: true }
    )
      .populate({
        path: "tags",
        select: "translations",
      })
      .populate({
        path: "subCategories",
        select: "translations",
      })
      .populate({
        path: "image",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .populate({
        path: "icon",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .populate({
        path: "banners",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .lean();

    if (!category) {
      throwError("Category does not exist.", 404);
    }

    if (lang) {
      const translation =
        (category.translations || []).find((t) => t.lang === lang) || {};
      category = { ...category, ...translation, translations: undefined };
    }

    if (lang) {
      if (category.tags) {
        category.tags = category.tags.map((tag) => {
          const t =
            (tag.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: tag._id };
        });
      }

      if (category.subCategories) {
        category.subCategories = category.subCategories.map((sub) => {
          const t =
            (sub.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: sub._id };
        });
      }
    }

    const filterMedia = (media) => {
      if (!media) return null;
      if (Array.isArray(media)) {
        return media.map((m) => {
          const t = (m.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...m, ...t, translations: undefined };
        });
      } else {
        const t =
          (media.translations || []).find((tr) => tr.lang === lang) || {};
        return { ...media, ...t, translations: undefined };
      }
    };

    category.image = filterMedia(category.image);
    category.icon = filterMedia(category.icon);
    category.banners = filterMedia(category.banners);

    return category;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Category does not exist.", 404);
    }

    const category = await Category.findByIdAndDelete(_id);

    return category;
  },
};

module.exports = { categoryService };
