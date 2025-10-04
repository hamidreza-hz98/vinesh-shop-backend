const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// SEO schema (basic, extend if ./SEO.js includes more)
const seoSchema = Joi.object({
  title: Joi.string().trim().max(255).allow(null, ""),
  description: Joi.string().trim().max(500).allow(null, ""),
  keywords: Joi.string().trim().allow(null, ""),
});

// Translation schema
const translationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  title: Joi.string().trim().min(1).max(200).required(),
  slug: Joi.string().trim().min(1).max(200).required(),
  excerpt: Joi.string().trim().min(1).max(1000).required(),
  timeToread: Joi.string().trim().allow("").default(""),
  text: Joi.string().trim().required(),
  seo: seoSchema.optional(),
});

// Blog schema
const blogSchema = {
  create: Joi.object({
    author: Joi.string().trim().default("Admin"),
    // image: objectId.required(),

    tags: Joi.array().items(objectId).default([]),
    categories: Joi.array().items(objectId).default([]),
    relatedBlogs: Joi.array().items(objectId).default([]),
    suggestedProducts: Joi.array().items(objectId).default([]),

    isPublished: Joi.boolean().default(true),
    isFeatured: Joi.boolean().default(false),

    translations: Joi.array().items(translationSchema).min(1).required(),

    likes: Joi.number().min(0).default(0),
    dislikes: Joi.number().min(0).default(0),
    visits: Joi.number().min(0).default(0),
  }),

  update: Joi.object({
    author: Joi.string().trim(),
    // image: objectId,

    tags: Joi.array().items(objectId),
    categories: Joi.array().items(objectId),
    relatedBlogs: Joi.array().items(objectId),
    suggestedProducts: Joi.array().items(objectId),

    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),

    translations: Joi.array().items(translationSchema).min(1),

    likes: Joi.number().min(0),
    dislikes: Joi.number().min(0),
    visits: Joi.number().min(0),
  }),
};

module.exports = { blogSchema };
