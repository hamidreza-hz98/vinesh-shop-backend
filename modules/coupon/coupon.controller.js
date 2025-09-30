const { couponService } = require("./coupon.service");

const couponController = {
  async create(req, res) {
    const data = req.body;

    try {
      const coupon = await couponService.create(data);

      res.success({
        message: `Coupon ${coupon.name} created successfully`,
        data: coupon,
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
      const coupon = await couponService.update(_id, data);

      res.success({
        message: `Coupon ${coupon.name} updated successfully`,
        data: coupon,
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
      const { coupons, total } = await couponService.getAll(queries);

      res.success({
        data: { coupons, total, ...queries },
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
      const coupon = await couponService.delete(_id);

      res.success({
        message: `Coupon ${coupon.name} deleted successfully`,
      });
    } catch (error) {
      res.error({
        message: error.message || "Something went wrong.",
        code: error.statusCode,
      });
    }
  },
};

module.exports = { couponController };
