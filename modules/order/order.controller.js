const { orderService } = require("./order.service");

const orderController = {
  async create(req, res) {
    const data = req.body;

    try {
      const order = await orderService.create(data);

      res.success({
        message: `Order ${order.trackNumber} created successfully.`,
        data: order,
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
      const order = await orderService.update(_id, data);

      res.success({
        message: `Order ${order.trackNumber} updated successfully.`,
        data: order,
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
      const { orders, total } = await orderService.getAll(queries);

      res.success({
        data: {
          orders,
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

  async getDetails(req, res) {
    const _id = req.params.id;

    try {
      const order = await orderService.getDetails(_id);

      res.success({
        data: order,
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
      const order = await orderService.delete(_id);

      res.success({
        message: `Order ${order.trackNumber} deleted successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getUserOrders(req, res) {
    const user = req.params.userId;
    const queries = req.body;

    try {
      const { orders, total } = await orderService.getUserOrders(user, queries);

      res.success({
        data: {
          orders,
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

  async getUserOrderDetails(req, res) {
    const { code, lang } = req.query;

    try {
      const order = await orderService.getUserOrderDetails(code, lang);

      res.success({
        data: order,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { orderController };
