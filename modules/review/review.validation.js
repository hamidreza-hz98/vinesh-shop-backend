const Joi = require("joi");
const mongoose = require("mongoose");

// ObjectId validator
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

// Review schema
const reviewSchema = {
  create: Joi.object({
    user: objectId.required(),
    title: Joi.string().trim().min(1).max(200).required(),
    text: Joi.string().trim().min(1).max(2000).required(),
    rate: Joi.number().min(1).max(5).required(),
    replies: Joi.array().items(objectId),
    status: Joi.string().valid("accepted", "rejected", "pending").default("pending"),
    entityType: Joi.string().valid("Product", "Blog").required(),
    entity: objectId.required(),
    media: Joi.array().items(objectId),
    rejectionreason: Joi.string().allow("", null),
    isReply: Joi.boolean().default(false),
    likes: Joi.number().min(0).default(0),
    dislikes: Joi.number().min(0).default(0),
  }),

  update: Joi.object({
    user: objectId,
    title: Joi.string().trim().min(1).max(200),
    text: Joi.string().trim().min(1).max(2000),
    rate: Joi.number().min(1).max(5),
    replies: Joi.array().items(objectId),
    status: Joi.string().valid("accepted", "rejected", "pending"),
    entityType: Joi.string().valid("Product", "Blog"),
    entity: objectId,
    media: Joi.array().items(objectId),
    rejectionreason: Joi.string().allow("", null),
    isReply: Joi.boolean(),
    likes: Joi.number().min(0),
    dislikes: Joi.number().min(0),
  }),
};

module.exports = { reviewSchema };
