const { addressService } = require("./address.service");

const addressController = {
  async create(req, res) {
    const data = req.body;

    try {
      const address = await addressService.create(data);

      res.success({
        message: `Address ${address.name} created successfully.`,
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async update(req, res) {
    const _id = req.params.id;
    const data = req.body;

    try {
      const address = await addressService.update(_id, data);

      res.success({
        message: `Address ${address.name} updated successfully.`,
        data: address,
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
      const { addresses, total } = await addressService.getAll(queries);

      res.success({
        data: {
          addresses,
          total,
          ...queries,
        },
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getDetails(req, res) {
    const _id = req.params.id;

    try {
      const address = await addressService.getDetails(_id);

      res.success({
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getUserAddresses(req, res) {
    const userId = req.params.userId;

    try {
      const addresses = await addressService.getUserAddresses(userId);

      res.success({
        data: addresses,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async getUserAddressDetails(req, res) {
    const _id = req.params.id;
    const userId = req.params.userId;

    try {
      const address = await addressService.getUserAddressDetails(_id, userId);

      res.success({
        data: address,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },

  async makeDefault(req, res) {
    const _id = req.params.id;
    const userId = req.params.userId;

    try {
      const address = await addressService.makeDefault(_id, userId);

      res.success({
        message: `Address ${address.name} set as default.`,
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
      const address = await addressService.delete(_id);

      res.success({
        message: `Address ${address.name} deleted successfully.`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { addressController };
