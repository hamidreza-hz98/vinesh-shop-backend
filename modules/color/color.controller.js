const { colorService } = require("./color.service");

const colorController = {
  async create(req, res) {
    const data = req.body;

    try {
      const color = await colorService.create(data);

      res.success({
        message: "Color created successfully.",
        data: color,
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
      const color = await colorService.update(_id, data);

      res.success({
        message: "Color updated successfully.",
        data: color,
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
      const { colors, total } = await colorService.getAll();

      res.success({
        data: { colors, total },
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
      const color = await colorService.delete(_id);

      res.success({
        message: "Color delete successfully.",
        data: color,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { colorController };
