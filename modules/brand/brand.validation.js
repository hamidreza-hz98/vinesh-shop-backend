const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const seoSchema = Joi.object({
  title: Joi.string().trim().max(255).allow(null, ""),
  description: Joi.string().trim().max(500).allow(null, ""),
  keywords: Joi.string().allow(null, ""),
});

const translationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  name: Joi.string().trim().min(1).max(100).required(),
  slug: Joi.string().trim().min(1).max(150).required(),
  excerpt: Joi.string().trim().max(500).allow("", null),
  description: Joi.string().trim().allow("", null),
  seo: seoSchema.optional(),
});

const brandSchema = {
  create: Joi.object({
    image: objectId,
    tags: Joi.array().items(objectId).default([]),
    categories: Joi.array().items(objectId).default([]),
    translations: Joi.array().items(translationSchema).min(1).required(),
    isFeatured: Joi.boolean().default(true),
    isActive: Joi.boolean().default(false),
    visits: Joi.number().min(0).default(0),
  }),

  update: Joi.object({
    image: objectId,
    tags: Joi.array().items(objectId),
    categories: Joi.array().items(objectId),
    translations: Joi.array().items(translationSchema).min(1),
    isFeatured: Joi.boolean(),
    isActive: Joi.boolean(),
    visits: Joi.number().min(0),
  }),
};

module.exports = { brandSchema };
