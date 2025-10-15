const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// SEO schema (you can extend based on your ./SEO.js structure)
const seoSchema = Joi.object({
  title: Joi.string().trim().max(255).allow(null, ""),
  description: Joi.string().trim().max(500).allow(null, ""),
  keywords: Joi.string().allow(null, ""),
});

// Translation schema
const translationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  name: Joi.string().trim().min(1).max(100).required(),
  slug: Joi.string().trim().min(1).max(150).required(),
  banners: Joi.array().items(objectId).default([]),
  excerpt: Joi.string().trim().min(1).max(500).required(),
  description: Joi.string().trim().min(1).required(),
  seo: seoSchema.optional(),
});

// Category schema
const categorySchema = {
  create: Joi.object({
    image: objectId.allow(null),
    icon: objectId.allow(null),
    subCategories: Joi.array().items(objectId).default([]),
    tags: Joi.array().items(objectId).default([]),
    isActive: Joi.boolean().default(false),
    visits: Joi.number().min(0).default(0),
    translations: Joi.array().items(translationSchema).min(1).required(),
  }),

  update: Joi.object({
    image: objectId.allow(null),
    icon: objectId.allow(null),
    subCategories: Joi.array().items(objectId),
    tags: Joi.array().items(objectId),
    isActive: Joi.boolean(),
    visits: Joi.number().min(0),
    translations: Joi.array().items(translationSchema).min(1),
  }),
};

module.exports = { categorySchema };
