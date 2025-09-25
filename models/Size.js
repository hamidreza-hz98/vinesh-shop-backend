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

const SizeSchema = new Schema({
  dimensions: {
    width: String,
    height: String,
    depth: String,
    weight: String,
  },
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

SizeSchema.plugin(timestamps);

SizeSchema.index({ "translations.lang": 1, "translations.name": 1 });
Size.find({ "translations.lang": "en", "translations.name": "Small" });
SizeSchema.index({ "translations.name": "text" });
SizeSchema.index({ "dimensions.width": 1 });
SizeSchema.index({ "dimensions.height": 1 });

module.exports = mongoose.model("Size", SizeSchema);
