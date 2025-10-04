const { buildQuery } = require("../../lib/filter");
const { filterMedia } = require("../../lib/general");
const Blog = require("../../models/Blog");
const throwError = require("../../middlewares/throw-error")

const blogService = {
  async exists(filter) {
    return await Blog.findOne(filter).lean();
  },

  async create(data) {
    const translation = data.translations.find((item) => item.lang === "us");
    const existing = await this.exists({
      "translations.slug": translation.slug,
    });

    if (existing) {
      throwError("Blog already exists.");
    }

    const blog = new Blog(data);
    return await blog.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Blog does not exist.", 404);
    }

    const blog = await Blog.findByIdAndUpdate(_id, data, { new: true });

    return blog;
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

    let [blogs, total] = await Promise.all([
      Blog.find(criteria).sort(sortOptions).skip(skip).limit(page_size).lean(),
      Blog.countDocuments(criteria),
    ]);

    if (lang) {
      blogs = blogs.map((b) => {
        const translation = b.translations.find((t) => t.lang === lang) || {};
        return {
          ...b,
          ...translation,
          translations: undefined,
          _id: b._id,
        };
      });
    }

    return { blogs, total };
  },

  async getDetails(filter, lang = null) {
    if (!filter || Object.keys(filter).length === 0) {
      throwError("Blog does not exist.", 404);
    }

    let blog = await Blog.findOneAndUpdate(
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
        path: "relatedBlogs",
        select:
          "translations image tags categories isFeatured likes dislikes visits",
      })
      // .populate({
      //   path: "reviews",
      //   select: "user title text rate",
      // })
      .populate({
        path: "suggestedProducts",
        select: "translations media colors sizes rate quantity",
      })
      .populate({
        path: "image",
        select:
          "filename originalName extension mimeType size path type translations",
      })
      .lean();

    if (!blog) {
      throwError("Blog does not exist.", 404);
    }

    if (lang) {
      const translation =
        (blog.translations || []).find((t) => t.lang === lang) || {};
      blog = { ...blog, ...translation, translations: undefined };
    }

    if (lang) {
      if (blog.tags) {
        blog.tags = blog.tags.map((tag) => {
          const t =
            (tag.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: tag._id };
        });
      }

      if (blog.categories) {
        blog.categories = blog.categories.map((cat) => {
          const t =
            (cat.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, _id: cat._id };
        });
      }

      if (blog.suggestedProducts) {
        blog.suggestedProducts = blog.suggestedProducts.map((item) => {
          const t =
            (item.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, ...item, translations: undefined, _id: item._id };
        });
      }

      if (blog.relatedBlogs) {
        blog.relatedBlogs = blog.relatedBlogs.map((item) => {
          const t =
            (item.translations || []).find((tr) => tr.lang === lang) || {};
          return { ...t, ...item, translations: undefined, _id: item._id };
        });
      }
    }

    blog.media = filterMedia(blog.media);

    return blog;
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Blog does not exist.", 404);
    }

    const blog = await Blog.findByIdAndDelete(_id);

    return blog;
  },
};

module.exports = { blogService };
