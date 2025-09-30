const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const CartSchema = new Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
  suggestedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  price: {
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "$",
      trim: true,
    },
  },
});

CartSchema.plugin(timestamps);

// Indexes
CartSchema.index({ user: 1 }, { unique: true });
CartSchema.index({ "products.product": 1 });
CartSchema.index({ suggestedProducts: 1 });
CartSchema.index({ coupon: 1 }, { sparse: true });
CartSchema.index({ createdAt: -1 });
CartSchema.index({ updatedAt: -1 });

module.exports = mongoose.model("Cart", CartSchema);
