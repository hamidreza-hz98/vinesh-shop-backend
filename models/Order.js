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
    default: () => createOrderTrackNumber(),
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
  },
  price: {
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "$",
    },
  },
  discount: {
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "$",
    },
  },
  shipmentPrice: {
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "$",
    },
  },
  finalPrice: {
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "$",
    },
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shipmentDate: {
    type: Date,
    default: null,
  },
  shipmentTrackNumber: {
    type: String,
    default: "",
  },
});

OrderSchema.plugin(timestamps);

OrderSchema.index({ user: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ transaction: 1 });
OrderSchema.index({ cart: 1 });
OrderSchema.index({ shipmentTrackNumber: 1 }, { sparse: true });
OrderSchema.index({ "finalPrice.amount": 1 });
OrderSchema.index({ shipmentDate: 1 });
OrderSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
