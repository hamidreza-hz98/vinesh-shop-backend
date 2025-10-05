const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const throwError = require("../../middlewares/throw-error");
const User = require("../../models/User");
const { buildQuery } = require("../../lib/filter");
const { generateToken } = require("../../lib/token");

const userService = {
  async exists(filter) {
    const sanitizedFilter = { ...filter };
    delete sanitizedFilter.password;

    return await User.findOne(sanitizedFilter);
  },

  async create(data) {
    const existing = await this.exists({ phone: data.phone });
    existing && throwError("User with this mobile number already exists.");

    const user = new User(data);
    return await user.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("User does not exist.", 404);
    }

    const user = await User.findByIdAndUpdate(_id, data, { new: true });
    const { password: _, ...userData } = user.toObject();

    return { user: userData };
  },

  async getDetails(filter) {
    const existing = await this.exists(filter);

    if (!existing) {
      throwError("User does not exist.", 404);
    }

    return existing;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: ["firstName", "lastName", "email", "phone"],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [users, total] = await Promise.all([
      User.find(criteria, "-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size),
      User.countDocuments(criteria),
    ]);

    return {
      users,
      total,
    };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("User does not exist.", 404);
    }

    return await User.findByIdAndDelete(_id);
  },

  async signup(data) {
    const existing = await this.exists(data);

    if (existing) {
      throwError("User with this credentials already exists");
    }

    const user = await this.create(data);

    const token = generateToken({
      id: user._id,
      type: "user",
    });

    const { password: _, ...userData } = user.toObject();

    return { user: userData, token };
  },

  async login(data) {
    const existing = await this.exists(data);

    if (!existing) {
      throwError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(data.password, existing.password);
    if (!isMatch) {
      throwError("Invalid credentials", 401);
    }

    const token = generateToken({
      id: existing._id,
      type: "user",
    });

    const { password: _, ...userData } = existing.toObject();

    return { user: userData, token };
  },

  async changePassword(data) {
    const { _id, oldPassword, newPassword } = data;

    let user = await this.exists({ _id });

    if (!user) {
      throwError("User does not exist.", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throwError("Old password is incorrect", 401);
    }

    const isSame = oldPassword === newPassword;
    if (isSame) {
      throwError("Choose a new password", 401);
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { password: newPassword },
      { new: true }
    );

    const { password: _, ...userData } = updatedUser.toObject();

    return { user: userData };
  },
};

module.exports = { userService };
