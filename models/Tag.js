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

const TagSchema = new Schema({
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

TagSchema.plugin(timestamps);

TagSchema.index({ "translations.lang": 1, "translations.name": 1 });
TagSchema.index({ "translations.name": "text" });

module.exports = mongoose.model("Tag", TagSchema);
