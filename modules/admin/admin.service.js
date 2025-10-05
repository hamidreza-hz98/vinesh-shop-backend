const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const throwError = require("../../middlewares/throw-error");
const Admin = require("../../models/Admin");
const { buildQuery } = require("../../lib/filter");
const { generateToken } = require("../../lib/token");

const adminService = {
  async exists(filter) {
    const sanitizedFilter = { ...filter };
    delete sanitizedFilter.password;

    return await Admin.findOne(sanitizedFilter);
  },

  async create(data) {
    const existing = await this.exists({ username: data.username });
    existing && throwError("Admin with this mobile number already exists.");

    const admin = new Admin(data);
    return await admin.save();
  },

  async update(_id, data) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Admin does not exist.", 404);
    }

    const admin = await Admin.findByIdAndUpdate(_id, data, { new: true });
    const { password: _, ...adminData } = admin.toObject();

    return adminData;
  },

  async getDetails(filter) {
    const existing = await this.exists(filter);

    if (!existing) {
      throwError("Admin does not exist.", 404);
    }

    return existing;
  },

  async getAll({ filter, search, sort, page = 1, page_size = 10 }) {
    const { criteria, sortOptions } = buildQuery({
      filter,
      search,
      searchFields: ["firstName", "lastName", "username", "role"],
      sort,
      page,
      page_size,
    });

    const skip = (page - 1) * page_size;

    const [admins, total] = await Promise.all([
      Admin.find(criteria, "-password")
        .sort(sortOptions)
        .skip(skip)
        .limit(page_size),
      Admin.countDocuments(criteria),
    ]);

    return {
      admins,
      total,
    };
  },

  async delete(_id) {
    const existing = await this.exists({ _id });

    if (!existing) {
      throwError("Admin does not exist.", 404);
    }

    return await Admin.findByIdAndDelete(_id);
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

    const token =  generateToken({
      id: existing._id,
      type: "admin",
      role: existing.role,
    });

    const { password: _, ...adminData } = existing.toObject();

    return { admin: adminData, token };
  },

  async changePassword(data) {
    const { _id, oldPassword, newPassword } = data;

    let admin = await this.exists({ _id });

    if (!admin) {
      throwError("Admin does not exist.", 404);
    }
    
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      throwError("Old password is incorrect", 401);
    }
    
    const isSame = oldPassword === newPassword
    if(isSame){
      throwError("Choose a new password", 401);
    }

    const updatedAdmin =  await Admin.findByIdAndUpdate(_id, {password: newPassword}, { new: true });

    const { password: _, ...adminData } = updatedAdmin.toObject();

    return { admin: adminData };
  },
};

module.exports = { adminService };
