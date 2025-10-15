const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const { slugify } = require("../lib/general");

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
  slug: {
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

TagSchema.pre("save", function (next) {
  if (this.translations && Array.isArray(this.translations)) {
    this.translations = this.translations.map((t) => ({
      ...t,
      slug: slugify(t.name),
    }));
  }
  next();
});

TagSchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  const update = this.getUpdate();

  const translations = update?.$set?.translations || update?.translations;

  if (translations && Array.isArray(translations)) {
    const updatedTranslations = translations.map((t) => ({
      ...t,
      slug: slugify(t.name),
    }));

    if (update.$set) {
      update.$set.translations = updatedTranslations;
    } else {
      update.translations = updatedTranslations;
    }

    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Tag", TagSchema);
