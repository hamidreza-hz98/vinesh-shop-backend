const Coupon = require("../../models/Coupon");
const throwError = require("../../middlewares/throw-error");
const { buildQuery } = require("../../lib/filter");
const { calculateCouponExpiryStatus } = require("../../lib/date");

const couponService = {
  async exists(filter) {
    return await Coupon.findOne(filter).populate("users products");
  },

  async create(data) {
    const existing = await this.exists({ code: data.code });
    if (existing) {
      throwError("Coupon with this code already exists.");
    }

    const coupon = new Coupon(data);
    return await coupon.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Coupon not found.", 404);
    }

    const coupon = await Coupon.findByIdAndUpdate(_id, data, { new: true });

    return coupon;
  },

  async getDetails(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Coupon not found.", 404);
    }

    const coupon = await Coupon.findById(_id);
    return coupon;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: [
        "translations.name",
        "translations.slug",
        "translations.excerpt",
        "translations.description",
        "brand.translations.name",
      ],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [coupons, total] = await Promise.all([
      Coupon.find(criteria)
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size)
        .lean(),
      Coupon.countDocuments(criteria),
    ]);

    return { coupons, total };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });
    if (!existing) {
      throwError("Coupon not found.", 404);
    }

    const coupon = await Coupon.findByIdAndDelete(_id);

    return coupon;
  },

  async isValid(_id) {
    const coupon = await this.existing({ _id });
    if (!coupon || coupon.used >= coupon.usageNumber) {
      return false;
    }

    const couponStatus = calculateCouponExpiryStatus(coupon.expiry);
    if (couponStatus === "expired") {
      return false;
    }

    return true;
  },
};

module.exports = { couponService };
