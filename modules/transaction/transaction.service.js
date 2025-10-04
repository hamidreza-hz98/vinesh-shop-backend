const Transaction = require("../../models/Transaction");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const transactionService = {
  async exists(filter) {
    return await Transaction.findOne(filter);
  },

  async create(data) {
    const existing = await this.exists({ trackingCode: data.trackingCode });

    

    if (existing) {
      throwError("Transaction already exists.");
    }

    const transaction = new Transaction(data);

    return await transaction.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Transaction not found.", 404);
    }

    const transaction = await Transaction.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return transaction;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "user.firstName",
        "user.lastName",
        "user.phone",
        "trackingCode",
        "referrerBank",
        "status",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [transactions, total] = await Promise.all([
      Transaction.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Transaction.countDocuments(criteria),
    ]);

    return { transactions, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Transaction not found.", 404);
    }

    const transaction = await Transaction.findByIdAndDelete(_id);

    return transaction;
  },
};

module.exports = { transactionService };
