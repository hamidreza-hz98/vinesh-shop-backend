const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const userSchema = {
  create: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be 10–15 digits, and may optionally start with +.",
      }),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    shebaNumber: Joi.string().length(24).allow("", null),
    birthdate: Joi.date().iso().less("now").allow(null),
  }),

  update: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{10,15}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Phone number must be 10–15 digits, and may optionally start with +.",
      }),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(128),
    shebaNumber: Joi.string().length(24).allow("", null),
    birthdate: Joi.date().iso().less("now"),
    cart: objectId,
    wishlist: Joi.array().items(objectId),
    addresses: Joi.array().items(objectId),
    orders: Joi.array().items(objectId),
    transactions: Joi.array().items(objectId),
    reviews: Joi.array().items(objectId),
    discounts: Joi.array().items(objectId),
    recentlyVisitedProducts: Joi.array().items(objectId),
    recentlyPurchasedProducts: Joi.array().items(objectId),
    frequentlyPurchasedProducts: Joi.array().items(objectId),
  }),

  delete: Joi.object({
    _id: objectId.required(),
  }),

  authenticate: Joi.object({
    _id: objectId.required(),
    token: Joi.string().required(),
  }),

  login: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string()  .pattern(/^\+?[0-9]{10,15}$/)
      .messages({
        "string.pattern.base":
          "Phone number must be 10–15 digits, and may optionally start with +.",
      }),
    password: Joi.string().min(6).max(128).required(),
  }).xor("email", "phone"),

  changePassword: Joi.object({
    _id: objectId.required(),
    oldPassword: Joi.string().min(6).max(128).required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};

module.exports = { userSchema };
