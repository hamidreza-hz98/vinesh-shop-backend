const { sizeService } = require("./size.service");

const sizeController = {
  async create(req, res) {
    const data = req.body;

    try {
      const size = await sizeService.create(data);

      res.success({
        message: "Size created successfilly",
        data: size,
      });
    } catch (error) {
      res.error({
        messge: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const size = await sizeService.update(_id, data);

      res.success({
        message: "Size updated successfilly",
        data: size,
      });
    } catch (error) {
      res.error({
        messge: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    try {
      const { sizes, total } = await sizeService.getAll();

      res.success({
        data: { sizes, total },
      });
    } catch (error) {
      res.error({
        messge: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const size = await sizeService.delete(_id, data);

      res.success({
        message: "Size deleted successfilly",
        data: size,
      });
    } catch (error) {
      res.error({
        messge: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { sizeController };
