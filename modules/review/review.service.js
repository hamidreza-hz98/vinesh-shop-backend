const Review = require("../../models/Review");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");

const reviewService = {
  async exists(filter) {
    return await Review.findOne(filter);
  },

  async create(data) {
    const review = new Review(data);

    return await review.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Review not found", 404);
    }

    const review = await Review.findByIdAndUpdate(_id, data, { new: true });
    return review;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "user.firstName",
        "user.lastName",
        "user.phone",
        "user.email",
        "title",
        "text",
        "status",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    let [reviews, total] = await Promise.all([
      Review.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Review.countDocuments(criteria),
    ]);

    return { reviews, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Review not found", 404);
    }
    return await Review.findByIdAndDelete(_id);
  },
};

module.exports = { reviewService };
