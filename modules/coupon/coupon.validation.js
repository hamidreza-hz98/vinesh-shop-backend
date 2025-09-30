const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Amount schema
const amountSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().default("$"),
});

// Coupon schema
const couponSchema = {
  // Create a new coupon
  create: Joi.object({
    code: Joi.string().trim().min(1).required(),
    name: Joi.string().trim().min(1).required(),
    type: Joi.string().valid("discount", "prize").required(),
    users: Joi.array().items(objectId).default([]),
    products: Joi.array().items(objectId).default([]),
    percentage: Joi.number().min(0).max(100).default(0),
    amount: amountSchema.optional(),
    expiry: Joi.date().required(),
    usageNumber: Joi.number().min(0).default(0),
    used: Joi.number().min(0).default(0),
  }),

  // Update coupon
  update: Joi.object({
    code: Joi.string().trim().min(1),
    name: Joi.string().trim().min(1),
    type: Joi.string().valid("discount", "prize"),
    users: Joi.array().items(objectId),
    products: Joi.array().items(objectId),
    percentage: Joi.number().min(0).max(100),
    amount: amountSchema,
    expiry: Joi.date(),
    usageNumber: Joi.number().min(0),
    used: Joi.number().min(0),
  }),

  // Delete coupon
  delete: Joi.object({
    _id: objectId.required(),
  }),
};

module.exports = { couponSchema };
