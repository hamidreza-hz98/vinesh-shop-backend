const { blogService } = require("./blog.service");

const blogController = {
  async create(req, res) {
    const data = req.body;

    try {
      const blog = await blogService.create(data);

      res.success({
        message: `Blog ${blog.translations[0].slug} created successfully.`,
        data: blog,
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
      const blog = await blogService.update(_id, data);

      res.success({
        message: `Blog ${blog.translations[0].slug} updated successfully.`,
        data: blog,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const queries = req.body;

    try {
      const { blogs, total } = await blogService.getAll(queries);

      res.success({
        data: { blogs, total, ...queries },
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
      const blog = await blogService.getDetails(filter, lang);

      res.success({
        data: blog,
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
      const blog = await blogService.delete(_id);

      res.success({
        message: `Blog ${blog.translations[0].slug} deleted successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { blogController };
