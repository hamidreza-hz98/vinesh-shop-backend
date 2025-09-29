const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
}, "ObjectId validation");

const translationSchema = Joi.object({
  lang: Joi.string().min(2).max(5).required(),
  title: Joi.string().allow("", null),
  description: Joi.string().allow("", null),
  slug: Joi.string().lowercase().allow("", null),
  seoTitle: Joi.string().allow("", null),
  seoDescription: Joi.string().allow("", null),
  seoKeywords: Joi.array().items(Joi.string()),
  mediaAlt: Joi.string().allow("", null),
  mediaTitle: Joi.string().allow("", null),
  mediaCaption: Joi.string().allow("", null),
  mediaTranscript: Joi.string().allow("", null),
});

const mediaSchema = {
  upload: Joi.object({
    path: Joi.string().required(),
    type: Joi.string().valid("image", "video", "file", "icon", "audio").required(),
    translations: Joi.array().items(translationSchema),
  }),

  update: Joi.object({
    path: Joi.string(),
    type: Joi.string().valid("image", "video", "file", "icon", "audio"),
    translations: Joi.array().items(translationSchema),
  }),

  delete: Joi.object({
    _id: objectId.required(),
  }),

  getDetails: Joi.object({
    _id: objectId,
    slug: Joi.string().lowercase(),
  }).or("_id", "slug"),
};

module.exports = { mediaSchema };
