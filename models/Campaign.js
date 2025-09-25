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

const CampaignSchema = new Schema({
  banner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  translations: {
    type: [TranslationSchema],
    required: true,
  },
});

CampaignSchema.plugin(timestamps);

CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ expiry: 1 });
CampaignSchema.index({ startDate: 1, expiry: 1 });

CampaignSchema.index({ products: 1 }, { sparse: true });

CampaignSchema.index({ "translations.lang": 1 });
CampaignSchema.index({
  "translations.name": "text",
  "translations.excerpt": "text",
});

CampaignSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Campaign", CampaignSchema);
