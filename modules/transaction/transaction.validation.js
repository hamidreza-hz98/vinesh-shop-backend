const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Price schema
const priceSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().min(1).max(5).required(),
});

// Transaction schema
const transactionSchema = {
  create: Joi.object({
    user: objectId.required(),
    trackingCode: Joi.string().trim().optional(),
    referrerBank: Joi.string().trim().optional(),
    price: priceSchema.required(),
    status: Joi.string().valid("failed", "successful").required(),
  }),

  update: Joi.object({
    user: objectId.optional(),
    trackingCode: Joi.string().trim().optional(),
    referrerBank: Joi.string().trim().optional(),
    price: priceSchema.optional(),
    status: Joi.string().valid("failed", "successful").optional(),
  }),
};

module.exports = { transactionSchema };
