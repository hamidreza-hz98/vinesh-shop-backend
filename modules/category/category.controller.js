const { categoryService } = require("./category.service");

const categoryController = {
  async create(req, res) {
    const data = req.body;

    try {
      const category = await categoryService.create(data);

      res.success({
        message: `Category ${category.translations[0].name} created successfully.`,
        data: category,
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
      const category = await categoryService.update(_id, data);

      res.success({
        message: `Category ${category.translations[0].name} updated successfully.`,
        data: category,
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
      const { categories, total } = await categoryService.getAll(queries);

      res.success({
        data: { categories, total, ...queries },
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
      const category = await categoryService.getDetails(filter, lang);

      res.success({
        data: category,
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
      const category = await categoryService.delete(_id);

      res.success({
        message: `Category ${category.translations[0].name} deleted successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { categoryController };
