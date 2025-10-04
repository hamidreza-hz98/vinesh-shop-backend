const { transactionService } = require("./transaction.service");

const transactionController = {
  async create(req, res) {
    const data = req.body;

    try {
      const transaction = await transactionService.create(data);

      res.success({
        message: "Transaction created successfully.",
        data: transaction,
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
      const transaction = await transactionService.update(_id, data);

      res.success({
        message: "Transaction updated successfully.",
        data: transaction,
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
      const { transactions, total } = await transactionService.getAll(queries);

      res.success({
        data: {
          transactions,
          total,
          ...queries,
        },
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
      const transaction = await transactionService.delete(_id);

      res.success({
        message: "Transaction deleted successfully.",
        data: transaction,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { transactionController };
