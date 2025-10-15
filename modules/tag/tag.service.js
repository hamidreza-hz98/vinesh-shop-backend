const Tag = require("../../models/Tag");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const tagService = {
  async exists(filter) {
    return await Tag.findOne(filter);
  },

  async create(data) {
    const tag = new Tag(data);

    return await tag.save();
  },

  async update(_id, data) {
    if (!_id) {
      throwError("Id is required");
    }

    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Tag does not exist.", 404);
    }

    const updatedTag = await Tag.findByIdAndUpdate(_id, data, { new: true });

    return updatedTag;
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
      searchFields: ["translations.name", "translations.slug"],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [tags, total] = await Promise.all([
      Tag.find(criteria).sort(sortOptions).skip(skip).limit(page_size).lean(),
      Tag.countDocuments(criteria),
    ]);

    if (lang) {
      tags = tags.map((tag) => {
        const translation = tag.translations.find((t) => t.lang === lang) || {};
        return {
          ...tag,
          ...translation,
          translations: undefined,
          _id: tag._id,
        };
      });
    }

    return { tags, total };
  },

  async delete(_id) {
    if (!_id) {
      throwError("Id is required");
    }

    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Tag does not exist.", 404);
    }

    const tag = await Tag.findByIdAndDelete(_id);

    return tag;
  },
};

module.exports = { tagService };
