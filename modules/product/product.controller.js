const { productService } = require("./product.service");

const productController = {
  async create(req, res) {
    const data = req.body;

    try {
      const product = await productService.create(data);

      res.success({
        message: `Product ${product.translations[0].name} created successfully.`,
        data: product,
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
      const product = await productService.update(_id, data);

      res.success({
        message: `Product ${product.translations[0].name} updated successfully.`,
        data: product,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const queries = req.query;

    try {
      const { products, total } = await productService.getAll(queries);

      res.success({
        data: { products, total, ...queries },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;
    const lang = filter.lang || null;
    delete filter.lang;

    try {
      const product = await productService.getDetails(filter, lang);

      res.success({
        data: product,
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
      const product = await productService.delete(_id);

      res.success({
        message: `Product ${product.translations[0].name} deleted successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { productController };
