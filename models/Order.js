const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const { createOrderTrackNumber } = require("../lib/general");

const OrderSchema = new Schema({
  orderType: {
    type: String,
    enum: ["online", "inPerson", "phone"],
    default: "online",
  },
  trackNumber: {
    type: String,
    unique: true,
    default: () => createOrderTrackNumber,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipping",
      "delivered",
      "canceled",
      "failed",
    ],
    required: true,
    default: "pending",
    trim: true,
  },
  address: {
    type: Schema.Types.Mixed,
    required: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  price: {
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
  discount: {
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
  shipmentPrice: {
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
  finalPrice: {
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
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shipmentDate: {
    type: date,
    default: "",
  },
  shipmentTrackNumber: {
    type: String,
    default: "",
  },
});

OrderSchema.plugin(timestamps);

OrderSchema.index({ trackNumber: 1 }, { unique: true });
OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ transaction: 1 });
OrderSchema.index({ products: 1 });
OrderSchema.index({ shipmentTrackNumber: 1 }, { sparse: true });
OrderSchema.index({ "finalPrice.amount": 1 });
OrderSchema.index({ shipmentDate: 1 });
OrderSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
