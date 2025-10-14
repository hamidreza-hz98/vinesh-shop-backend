const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const TranslationSchema = new Schema(
  {
    lang: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    description: { type: String, trim: true },

    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: { type: String, trim: true },

    mediaAlt: { type: String, trim: true },
    mediaTitle: { type: String, trim: true },
    mediaCaption: { type: String, trim: true },
    mediaTranscript: { type: String, trim: true },
  },
  { timestamps: true }
);

TranslationSchema.index({ lang: 1 }, { unique: true });

const MediaSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true },
    path: { type: String, trim: true },
    originalName: { type: String, trim: true },
    extension: { type: String, trim: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },

    type: {
      type: String,
      enum: ["image", "video", "file", "icon", "audio"],
      required: true,
      index: true,
    },

    translations: { type: [TranslationSchema], required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
);

MediaSchema.pre("save", function (next) {
  if (this.isModified("filename") || !this.path) {
    this.path = `/uploads/${this.filename}`;
  }
  next();
});

MediaSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  const filename =
    update.filename ||
    (update.$set && update.$set.filename);

  const path =
    update.path ||
    (update.$set && update.$set.path);

  if (filename && !path) {
    const newPath = `/uploads/${filename}`;

    if (update.$set) {
      update.$set.path = newPath;
    } else {
      update.path = newPath;
    }
  }

  next();
});


MediaSchema.plugin(timestamps);

module.exports = mongoose.model("Media", MediaSchema);
