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
  discount: {
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      enum: ["percentage", "amount"],
      required: true,
      default: "percentage",
    },
    currency: {
      type: String,
      required: true,
      default: "$",
    },
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
    default: "",
  },
  warranthy: {
    type: String,
    default: "",
  },
  technicalDetails: [
    {
      key: String,
      value: String,
    },
  ],
  seo: {
    type: SeoSchema,
    default: () => ({}),
  },
});

const ProductSchema = new Schema({
  rate: {
    type: Number,
    default: 0,
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: [],
    },
  ],
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      default: [],
    },
  ],
  sizes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      default: [],
    },
  ],

  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: [],
    },
  ],
  relatedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  isInCampaign: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  visits: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
  },
  soldNumber: {
    type: Number,
    default: 0,
  },
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

ProductSchema.plugin(timestamps);

ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isInCampaign: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({
  "translations.name": "text",
  "translations.excerpt": "text",
});
ProductSchema.index({ visits: -1 });
ProductSchema.index({ soldNumber: -1 });

module.exports = mongoose.model("Product", ProductSchema);
