const { brandService } = require("./brand.service");

const brandController = {
  async create(req, res) {
    const data = req.body;

    try {
      const brand = await brandService.create(data);

      res.success({
        message: `Brand ${brand.translations[0].name} created successfully.`,
        data: brand,
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
      const brand = await brandService.update(_id, data);

      res.success({
        message: `Brand ${brand.translations[0].name} updated successfully.`,
        data: brand,
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
      const { brands, total } = await brandService.getAll(queries);

      res.success({
        data: { brands, total, ...queries },
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
      const brand = await brandService.getDetails(filter, lang);

      res.success({
        data: brand,
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
      const brand = await brandService.delete(_id);

      res.success({
        message: `Brand ${brand.translations[0].name} deleted successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { brandController };
