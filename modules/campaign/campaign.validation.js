const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// SEO schema
const seoSchema = Joi.object({
  title: Joi.string().trim().max(255).allow(null, ""),
  description: Joi.string().trim().max(500).allow(null, ""),
  keywords: Joi.string().allow(null, ""),
});

// Campaign translation schema
const campaignTranslationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  name: Joi.string().trim().min(1).max(100).required(),
  excerpt: Joi.string().trim().min(1).max(500).allow("").default(""),
  description: Joi.string().trim().allow("").default(""),
  discount: Joi.object({
    amount: Joi.number().min(0).required(),
    type: Joi.string().valid("percentage", "amount").default("percentage").required(),
    currency: Joi.string().trim().max(5).default("$").required(),
  }).required(),
  seo: seoSchema.optional(),
});

// Campaign schema validation
const campaignSchema = {
  create: Joi.object({
    banner: objectId.optional(),
    startDate: Joi.date().required(),
    expiry: Joi.date().required(),
    products: Joi.array().items(objectId).default([]),
    translations: Joi.array().items(campaignTranslationSchema).min(1).required(),
  }),

  update: Joi.object({
    banner: objectId,
    startDate: Joi.date(),
    expiry: Joi.date(),
    products: Joi.array().items(objectId),
    translations: Joi.array().items(campaignTranslationSchema).min(1),
  }),
};

module.exports = { campaignSchema };
