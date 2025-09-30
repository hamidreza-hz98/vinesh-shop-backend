const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// SEO schema (extend this to match ./SEO.js if needed)
const seoSchema = Joi.object({
  title: Joi.string().trim().max(255).allow(null, ""),
  description: Joi.string().trim().max(500).allow(null, ""),
  keywords: Joi.string().allow(null, ""),
});

// Translation schema
const translationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  name: Joi.string().trim().min(1).max(100).required(),

  price: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().trim().max(5).default("$").required(),
  }).required(),

  discount: Joi.object({
    amount: Joi.number().min(0).required(),
    type: Joi.string().valid("percentage", "amount").default("percentage").required(),
    currency: Joi.string().trim().max(5).default("$").required(),
  }).required(),

  slug: Joi.string().trim().min(1).max(150).required(),
  excerpt: Joi.string().trim().min(1).max(500).required(),
  description: Joi.string().trim().allow("").default(""),
  warranthy: Joi.string().trim().allow("").default(""),

  technicalDetails: Joi.array().items(
    Joi.object({
      key: Joi.string().trim().required(),
      value: Joi.string().trim().required(),
    })
  ).default([]),

  seo: seoSchema.optional(),
});

// Product schema
const productSchema = {
  create: Joi.object({
    rate: Joi.number().min(0).default(0),

    media: Joi.array().items(objectId).default([]),
    colors: Joi.array().items(objectId).default([]),
    sizes: Joi.array().items(objectId).default([]),

    quantity: Joi.number().integer().min(0).default(0).required(),

    relatedProducts: Joi.array().items(objectId).default([]),

    isInCampaign: Joi.boolean().default(false),
    isFeatured: Joi.boolean().default(false),
    isActive: Joi.boolean().default(false),

    visits: Joi.number().min(0).default(0),

    tags: Joi.array().items(objectId).default([]),
    categories: Joi.array().items(objectId).min(1).required(),
    brand: objectId.allow(null),

    soldNumber: Joi.number().min(0).default(0),

    translations: Joi.array().items(translationSchema).min(1).required(),
  }),

  update: Joi.object({
    rate: Joi.number().min(0),

    media: Joi.array().items(objectId),
    colors: Joi.array().items(objectId),
    sizes: Joi.array().items(objectId),

    quantity: Joi.number().integer().min(0),

    relatedProducts: Joi.array().items(objectId),

    isInCampaign: Joi.boolean(),
    isFeatured: Joi.boolean(),
    isActive: Joi.boolean(),

    visits: Joi.number().min(0),

    tags: Joi.array().items(objectId),
    categories: Joi.array().items(objectId).min(1),
    brand: objectId.allow(null),

    soldNumber: Joi.number().min(0),

    translations: Joi.array().items(translationSchema).min(1),
  }),
};

module.exports = { productSchema };
