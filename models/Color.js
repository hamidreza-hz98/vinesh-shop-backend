const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const TranslationSchema = new Schema({
  lang: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const ColorSchema = new Schema({
  code: {
    type: String,
    required: true,
    trim: true,
  },
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

ColorSchema.plugin(timestamps);

ColorSchema.index({ code: 1 }, { unique: true });
ColorSchema.index({ "translations.name": 1 });

module.exports = mongoose.model("Color", ColorSchema);
