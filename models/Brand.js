const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");
const SeoSchema = require("./SEO");

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
    trim: true,
  },
  excerpt: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
});

const BrandSchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    },
  ],
  translations: {
    type: [TranslationSchema],
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  visits: {
    type: Number,
    default: 0,
  },
});

BrandSchema.plugin(timestamps);

BrandSchema.index({ isActive: 1 });
BrandSchema.index({ isFeatured: 1 });
BrandSchema.index({ categories: 1 });
BrandSchema.index({ tags: 1 });
BrandSchema.index({ "translations.lang": 1 });
BrandSchema.index({
  "translations.name": "text",
  "translations.excerpt": "text",
});
BrandSchema.index({ visits: -1 });
BrandSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Brand", BrandSchema);
