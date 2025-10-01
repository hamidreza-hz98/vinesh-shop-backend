const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const timestamps = require("mongoose-timestamp");

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    default: "",
  },
  lastName: {
    type: String,
    required: true,
    default: "",
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    default: "",
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
  shebaNumber: {
    type: String,
    default: "",
  },
  birthdate: {
    type: Date,
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  recentlyVisitedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  recentlyPurchasedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
  frequentlyPurchasedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: [],
    },
  ],
});

UserSchema.plugin(timestamps);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});


UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ firstName: 1, lastName: 1 });
UserSchema.index({ birthdate: 1 });
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", UserSchema);
