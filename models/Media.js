const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const TranslationSchema = new Schema({
    lang: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, trim: true, lowercase: true, index: true },

    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: [{ type: String, trim: true }],

    mediaAlt: { type: String, trim: true },
    mediaTitle: { type: String, trim: true },
    mediaCaption: { type: String, trim: true },
    mediaTranscript: { type: String, trim: true },
  },
  { timestamps: true }
);

TranslationSchema.index({ lang: 1 }, { unique: true });

const MediaSchema = new Schema({
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, trim: true },
    extension: { type: String, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },

    path: { type: String, required: true, trim: true, index: true },

    type: {
      type: String,
      enum: ["image", "video", "file", "icon", "audio"],
      required: true,
      index: true,
    },

    translations: { type: [TranslationSchema], required: true },

    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  }
);

MediaSchema.plugin(timestamps);

MediaSchema.index({ type: 1, createdAt: -1 });
MediaSchema.index({ path: 1, filename: 1 }, { unique: true });
MediaSchema.index({ "translations.lang": 1, "translations.slug": 1 });
MediaSchema.index({ "translations.seoKeywords": 1 });

module.exports = mongoose.model("Media", MediaSchema);
