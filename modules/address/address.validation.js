const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// GeoLocation schema
const geoLocationSchema = Joi.object({
  type: Joi.string().valid("Point").default("Point").required(),
  coordinates: Joi.array()
    .items(Joi.number().min(-180).max(180))
    .length(2)
    .default([0, 0])
    .required(),
});

// Address schema
const addressSchema = {
  create: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    recipientName: Joi.string().trim().max(100).allow("", null),
    recipientPhone: Joi.string()
      .pattern(/^[0-9+\-() ]{7,20}$/)
      .allow("", null),
    address: Joi.string().trim().min(5).max(500).required(),
    zipCode: Joi.string().trim().min(3).max(20).required(),
    user: objectId.required(), // new field
    geoLocation: geoLocationSchema.required(),
    isDefault: Joi.boolean().default(false),
  }),

  update: Joi.object({
    name: Joi.string().trim().min(1).max(100),
    recipientName: Joi.string().trim().max(100).allow("", null),
    recipientPhone: Joi.string()
      .pattern(/^[0-9+\-() ]{7,20}$/)
      .allow("", null),
    address: Joi.string().trim().min(5).max(500),
    zipCode: Joi.string().trim().min(3).max(20),
    user: objectId, // user can’t really change normally, but included for completeness
    geoLocation: geoLocationSchema,
    isDefault: Joi.boolean(),
  }),

  getAll: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    userId: objectId.optional(),
  }),

  getDetails: Joi.object({
    addressId: objectId.required(),
  }),

  getUserAddresses: Joi.object({
    userId: objectId.required(),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),

  getUserAddressDetails: Joi.object({
    userId: objectId.required(),
    addressId: objectId.required(),
  }),

  makeDefault: Joi.object({
    userId: objectId.required(),
    addressId: objectId.required(),
  }),
};

module.exports = { addressSchema };
