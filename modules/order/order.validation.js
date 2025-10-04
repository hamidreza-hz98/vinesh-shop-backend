const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Price-like schema (for price, discount, shipmentPrice, finalPrice)
const moneySchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().min(1).max(5).required(),
});

// Order schema
const orderSchema = {
  create: Joi.object({
    orderType: Joi.string()
      .valid("online", "inPerson", "phone")
      .default("online"),

    trackNumber: Joi.string().trim().optional(),

    status: Joi.string()
      .valid("pending", "processing", "shipping", "delivered", "canceled", "failed")
      .default("pending"),

    address: objectId.required(),

    cart: objectId.required(),
    user: objectId.required(),

    shipmentDate: Joi.date().allow(null, "").optional(),
    shipmentTrackNumber: Joi.string().trim().allow("").optional(),
  }),

  update: Joi.object({
    orderType: Joi.string()
      .valid("online", "inPerson", "phone")
      .optional(),

    trackNumber: Joi.string().trim().optional(),

    status: Joi.string()
      .valid("pending", "processing", "shipping", "delivered", "canceled", "failed")
      .optional(),

    address: objectId.optional(),

    transaction: objectId.optional(),

    price: moneySchema.optional(),
    discount: moneySchema.optional(),
    shipmentPrice: moneySchema.optional(),
    finalPrice: moneySchema.optional(),

    cart: objectId.optional(),
    user: objectId.optional(),

    shipmentDate: Joi.date().allow(null, "").optional(),
    shipmentTrackNumber: Joi.string().trim().allow("").optional(),
  }),
};

module.exports = { orderSchema };
