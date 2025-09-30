const Tag = require("../../models/Tag");
const throwError = require("../../middlewares/throw-error");

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

  async getAll() {
    const [tags, total] = await Promise.all([Tag.find(), Tag.countDocuments()]);

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
