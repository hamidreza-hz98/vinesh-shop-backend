const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["discount", "prize"],
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  percentage: {
    type: Number,
    default: 0,
  },
  amount: {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "$",
    },
  },
  expiry: {
    type: Date,
    required: true,
  },
  usageNumber: {
    type: Number,
    default: 0,
  },
  used: {
    type: Number,
    default: 0,
  },
});

CouponSchema.plugin(timestamps);

CouponSchema.index({ expiry: 1 });
CouponSchema.index({ type: 1 });
CouponSchema.index({ users: 1 });
CouponSchema.index({ products: 1 });
CouponSchema.index(
  { code: 1 },
  { unique: true, partialFilterExpression: { expiry: { $gte: new Date() } } }
);

module.exports = mongoose.model("Coupon", CouponSchema);
