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

// Tag schema
const tagSchema = {
  create: Joi.object({
    translations: Joi.array().items(translationSchema).min(1).required(),
  }),

  update: Joi.object({
    translations: Joi.array().items(translationSchema).min(1),
  }),
};

module.exports = { tagSchema };
