const { tagService } = require("./tag.service");

const tagController = {
  async create(req, res) {
    const data = req.body;
    
    try {
      const tag = await tagService.create(data);

      res.success({
        message: "Tag created successfully.",
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const tag = await tagService.update(_id, data);

      res.success({
        message: "Tag updated successfully.",
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    try {
      const {tags, total} = await tagService.getAll();

      res.success({
        data: {tags, total},
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;

    try {
      const tag = await tagService.delete(_id);

      res.success({
        message: "Tag deleted successfully",
        data: tag,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { tagController };
