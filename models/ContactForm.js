const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const ContactFormSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["new", "responded"],
    default: "new",
  },
});

ContactFormSchema.plugin(timestamps);

ContactFormSchema.index({ status: 1 });
ContactFormSchema.index({ email: 1 });
ContactFormSchema.index({ phone: 1 });
ContactFormSchema.index({ message: "text" });

module.exports = mongoose.model("ContactForm", ContactFormSchema);
