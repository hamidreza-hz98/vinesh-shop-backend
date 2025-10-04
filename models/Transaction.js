const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const TransactionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  trackingCode: {
    type: String,
  },
  referrerBank: {
    type: String,
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
  status: {
    type: String,
    enum: ["failed", "successful"],
    required: true,
  },
});

TransactionSchema.plugin(timestamps);

TransactionSchema.index({ user: 1 });
TransactionSchema.index({ trackingCode: 1 }, { unique: true });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ createdAt: -1 });
TransactionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
