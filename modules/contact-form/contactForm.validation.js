const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Contact form schema
const contactFormSchema = {
  create: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    phone: Joi.string().trim().min(5).max(20).required(),
    email: Joi.string().trim().email().allow("").optional(),
    message: Joi.string().trim().min(5).max(1000).required(),
    response: Joi.string().trim().allow("").optional(),
    status: Joi.string().valid("new", "responded").default("new"),
  }),

  update: Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    phone: Joi.string().trim().min(5).max(20).optional(),
    email: Joi.string().trim().email().allow("").optional(),
    message: Joi.string().trim().min(5).max(1000).optional(),
    response: Joi.string().trim().allow("").optional(),
    status: Joi.string().valid("new", "responded").optional(),
  }),
};

module.exports = { contactFormSchema };
