const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Translation schema
const translationSchema = Joi.object({
  lang: Joi.string().trim().min(2).max(10).required(),
  name: Joi.string().trim().min(1).max(100).required(),
});

// Dimensions schema
const dimensionsSchema = Joi.object({
  width: Joi.string().trim().allow("", null),
  height: Joi.string().trim().allow("", null),
  depth: Joi.string().trim().allow("", null),
  weight: Joi.string().trim().allow("", null),
});

// Size schema
const sizeSchema = {
  create: Joi.object({
    dimensions: dimensionsSchema.optional(),
    translations: Joi.array().items(translationSchema).min(1).required(),
  }),

  update: Joi.object({
    dimensions: dimensionsSchema.optional(),
    translations: Joi.array().items(translationSchema).min(1),
  }),
};

module.exports = { sizeSchema };
