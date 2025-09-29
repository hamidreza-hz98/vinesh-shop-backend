const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const adminSchema = {
  create: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    username: Joi.string().alphanum().min(3).max(30).lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string().valid("superadmin", "admin").default("superadmin"),
  }),

  update: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    username: Joi.string().alphanum().min(3).max(30).lowercase(),
    password: Joi.string().min(6).max(128),
    role: Joi.string().valid("superadmin", "admin"),
  }),

  delete: Joi.object({
    _id: objectId.required(),
  }),

  login: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
  }),

  changePassword: Joi.object({
    _id: objectId.required(),
    oldPassword: Joi.string().min(6).max(128).required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};

module.exports = { adminSchema };
