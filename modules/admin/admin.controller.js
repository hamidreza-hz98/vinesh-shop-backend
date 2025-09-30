const { adminService } = require("./admin.service");

const adminController = {
  async create(req, res) {
    const data = req.body;

    try {
      const admin = await adminService.create(data);

      res.success({
        message: `Admin ${admin.firstName} ${admin.lastName} created successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const data = req.body;
    const _id = req.params.id;

    try {
      const admin = await adminService.update(_id, data);

      res.success({
        message: `Admin ${admin.firstName} ${admin.lastName} updated successfully.`,
        data: admin,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getDetails(req, res) {
    const filter = req.query;

    try {
      const admin = await adminService.getDetails(filter);

      res.success({
        data: admin,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getAll(req, res) {
    const queries = req.query;

    try {
      const { admins, total } = await adminService.getAll(queries);

      res.success({
        data: { admins, total, ...queries },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async delete(req, res) {
    const _id = req.params.id;

    try {
      const admin = await adminService.delete(_id);

      res.success({
        message: `Admin ${admin.firstName} ${admin.lastName} has been deleted successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async login(req, res){
    const data = req.body

     try {
      const { admin, token } = await adminService.login(data);

      res.success({
        message: `Wellcome Back ${admin.firstName}!`,
        data: { admin, token },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async changePassword(req, res){
    const data = req.body

     try {
      await adminService.changePassword(data);

      res.success({
        message: `Password changed successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  }
};

module.exports = { adminController };
