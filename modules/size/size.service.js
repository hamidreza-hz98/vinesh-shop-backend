const Size = require("../../models/Size");
const throwError = require("../../middlewares/throw-error");

const sizeService = {
  async exists(filter) {
    return await Size.findOne(filter);
  },

  async create(data) {
    const size = new Size(data);

    return await size.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Size not found", 404);
    }

    const size = await Size.findByIdAndUpdate(_id, data, { new: true });
    return size;
  },

  async getAll() {
    const [sizes, total] = await Promise.all([
      Size.find(),
      Size.countDocuments(),
    ]);

    return { sizes, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Size not found", 404);
    }

    const size = await Size.findByIdAndDelete(_id);

    return size;
  },
};

module.exports = { sizeService };
