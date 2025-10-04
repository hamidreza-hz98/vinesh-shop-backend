const { reviewService } = require("./review.service");

const reviewController = {
  async create(req, res) {
    const data = req.body;

    try {
      const review = await reviewService.create(data);

      res.success({
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const review = await reviewService.update(_id, data);
      res.success({
        message: "Review updated successfully",
        data: review,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const queries = req.body;

    try {
      const { reviews, total } = await reviewService.getAll(queries);
      res.success({
        data: { reviews, total, ...queries },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;

    try {
      await reviewService.delete(_id);
      res.success({
        message: "Review deleted successfully",
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { reviewController };
