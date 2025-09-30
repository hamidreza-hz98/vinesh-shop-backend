const { cartService } = require("./cart.service");

const cartController = {
  async create(req, res) {
    const data = req.body;

    try {
      const cart = await cartService.create(data);

      res.success({
        message: "Cart created successfully.",
        data: cart,
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
      const cart = await cartService.update(_id, data);

      res.success({
        data: cart,
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
      const { carts, total } = await cartService.getAll(queries);

      res.success({
        data: {
          carts,
          total,
          ...queries,
        },
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
      const cart = await cartService.delete(_id);

      res.success({
        message: "Cart deleted successfully",
        data: cart,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { cartController };
