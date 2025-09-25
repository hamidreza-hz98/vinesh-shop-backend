const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const ReviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: [],
    },
  ],
  status: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    required: true,
    default: "pending",
  },
  entityType: {
    type: String,
    enum: ["Product", "Blog"],
    required: true,
    default: "Product",
  },
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "entityType",
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: [],
    },
  ],
  rejectionreason: {
    type: String,
  },
  isReply: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

ReviewSchema.plugin(timestamps);

ReviewSchema.index({ entity: 1, entityType: 1, status: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ entity: 1, rate: -1 });
ReviewSchema.index({ title: "text", text: "text" });

module.exports = mongoose.model("Review", ReviewSchema);
