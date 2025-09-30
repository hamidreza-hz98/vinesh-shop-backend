const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Product item in cart schema
const productItemSchema = Joi.object({
  product: objectId.required(),
  quantity: Joi.number().min(1).required(),
});

// Price schema
const priceSchema = Joi.object({
  amount: Joi.number().min(0).required(),
  currency: Joi.string().trim().default("$"),
});

const cartSchema = {
  // Create a new cart
  create: Joi.object({
    lang: Joi.string().required(),
    user: objectId.required(),
    products: Joi.array().items(productItemSchema).default([]),
    suggestedProducts: Joi.array().items(objectId).default([]),
    coupon: objectId.allow(null),
    price: priceSchema.optional(),
  }),

  // Update cart (general update)
  update: Joi.object({
    action: Joi.number()
      .valid(1, -1)
      .required(),
    product: objectId.required(), // required product id
    user: objectId.optional(), // required only if cart doesn't exist
    lang: Joi.string().trim().min(2).max(10).optional(),
  }),

  // Add product to cart
  addToCart: Joi.object({
    product: objectId.required(),
    quantity: Joi.number().min(1).default(1),
  }),

  // Remove product from cart
  removeFromCart: Joi.object({
    product: objectId.required(),
  }),

  // Delete cart
  delete: Joi.object({
    user: objectId.required(),
  }),
};

module.exports = { cartSchema };
