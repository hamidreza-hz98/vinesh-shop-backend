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

// Color schema
const colorSchema = {
  create: Joi.object({
    code: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .required(), // e.g., "red", "#FF0000"
    translations: Joi.array().items(translationSchema).min(1).required(),
  }),

  update: Joi.object({
    code: Joi.string().trim().min(3).max(20),
    translations: Joi.array().items(translationSchema).min(1),
  })
};

module.exports = { colorSchema };
