const Color = require("../../models/Color");
const throwError = require("../../middlewares/throw-error");

const colorService = {
  async exists(filter) {
    return await Color.findOne(filter);
  },

  async create(data) {
    const existing = await this.exists({ code: data.code });
    if (existing) {
      throwError("Color with this code already exists.");
    }

    const color = new Color(data);
    return color.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Color does not exist.", 404);
    }

    const color = await Color.findByIdAndUpdate(_id, data, { new: true });

    return color;
  },

  async getAll() {
    const [colors, total] = await Promise.all([
      Color.find(),
      Color.countDocuments(),
    ]);

    return { colors, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Color does not exist.", 404);
    }

    const color = await Color.findByIdAndDelete(_id);

    return color;
  },
};

module.exports = { colorService };
