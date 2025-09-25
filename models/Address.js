const mongoose = require("mongoose");
const { Schema } = mongoose;
const timestamps = require("mongoose-timestamp");

const AddressSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    default: "",
  },
  recipientPhone: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  geoLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

AddressSchema.index({ geoLocation: "2dsphere" });
AddressSchema.plugin(timestamps);

module.exports = mongoose.model("Address", AddressSchema);
