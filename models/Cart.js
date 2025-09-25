const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const CartSchema = new Schema({
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: [],
  },
  suggestedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
});

CartSchema.plugin(timestamps);

CartSchema.index({ user: 1 }, { unique: true });
CartSchema.index({ products: 1 });
CartSchema.index({ suggestedProducts: 1 });
CartSchema.index({ coupon: 1 });
CartSchema.index({ createdAt: -1 });
CartSchema.index({ updatedAt: -1 });
CartSchema.index({ coupon: 1 }, { sparse: true });

module.exports = mongoose.model("Cart", CartSchema);
