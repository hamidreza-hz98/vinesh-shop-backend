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
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
});

const CategorySchema = new Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null
  },
  icon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null
  },
  banners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null
    },
  ],
  subCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: [],
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      default: [],
    },
  ],
  isActive: {
    type: Boolean,
    default: false,
  },
  isSubCategory: {
    type: Boolean,
    default: false
  },
  visits: {
    type: Number,
    default: 0,
  },
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

CategorySchema.plugin(timestamps);


CategorySchema.index(
  { isActive: 1 },
  { partialFilterExpression: { isActive: true } }
);
CategorySchema.index({ tags: 1 });
CategorySchema.index({ subCategories: 1 });
CategorySchema.index({
  "translations.name": "text",
  "translations.excerpt": "text",
});
CategorySchema.index({ visits: -1 });

module.exports = mongoose.model("Category", CategorySchema);
