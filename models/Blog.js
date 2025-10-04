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
  title: {
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
  timeToread: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: true,
  },
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
});

const BlogSchema = new Schema({
  author: {
    type: String,
    default: "Admin",
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    // required: true,
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
  relatedBlogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      default: [],
    },
  ],
  suggestedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  isPublished: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  translations: {
    type: [TranslationSchema],
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  visits: {
    type: Number,
    default: 0,
  },
});

BlogSchema.plugin(timestamps);

BlogSchema.index({ isFeatured: 1 });
BlogSchema.index(
  { isPublished: 1 },
  { partialFilterExpression: { isPublished: true } }
);
BlogSchema.index({
  "translations.title": "text",
  "translations.excerpt": "text",
});

module.exports = mongoose.model("Blog", BlogSchema);
