const { userService } = require("./user.service");

const userController = {
  async create(req, res) {
    const data = req.body;

    try {
      const user = await userService.create(data);

      res.success({
        message: `User ${user.firstName} ${user.lastName} created successfully.`,
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
      const user = await userService.update(_id, data);

      res.success({
        message: `User ${user.firstName} ${user.lastName} updated successfully.`,
        data: user,
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

    if (filter.phone) {
      filter.phone = `+${filter?.phone?.trim()}`;
    }

    try {
      const user = await userService.getDetails(filter);

      res.success({
        data: user,
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
      const { users, total } = await userService.getAll(queries);

      res.success({
        data: { users, total, ...queries },
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
      const user = await userService.delete(_id);

      res.success({
        message: `User ${user.firstName} ${user.lastName} has been deleted successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async signup(req, res) {
    const data = req.body;

    try {
      const { user, token } = await userService.signup(data);

      res.success({
        message: `User ${user.firstName} ${user.lastName} created successfully.`,
        data: { user, token },
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
      const { user, token } = await userService.login(data);

      res.success({
        message: `Wellcome Back ${user.firstName}!`,
        data: { user, token },
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
      await userService.changePassword(data);

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

module.exports = { userController };
