const fs = require("fs");
const path = require("path");
const throwError = require("../../middlewares/throw-error");
const Media = require("../../models/Media");

const mediaService = {
  async exists(filter) {
    return await Media.findOne(filter);
  },

  async upload(file, data) {
    if (!file) {
      throwError("File is required", 400);
    }

    const media = new Media({
      filename: file.filename,
      originalName: file.originalname,
      extension: path.extname(file.originalname).replace(".", ""),
      mimeType: file.mimetype,
      size: file.size,
      type: data.type,
      translations: data.translations || [],
      uploadedBy: data.uploadedBy,
    });

    return await media.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Media does not exist.", 404);
    }

    return await Media.findByIdAndUpdate(_id, data, { new: true });
  },

  async getDetails(filter) {
    const existing = await this.exists(filter);
    if (!existing) {
      throwError("Media does not exist.", 404);
    }
    return existing;
  },

  async getAll({ filter = {}, sort = "-createdAt", page = 1, page_size = 10 }) {
    const skip = (page - 1) * page_size;

    const [items, total] = await Promise.all([
      Media.find(filter).sort(sort).skip(skip).limit(page_size),
      Media.countDocuments(filter),
    ]);

    return { items, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Media does not exist.", 404);
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads",
      existing.filename
    );

    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      // log but don't crash if file is already gone
      console.error("File delete error:", err.message);
    }

    return await Media.findByIdAndDelete(_id);
  },
};

module.exports = { mediaService };
