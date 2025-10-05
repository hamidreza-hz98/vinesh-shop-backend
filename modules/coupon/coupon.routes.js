const express = require("express");
const { couponController } = require("./coupon.controller");
const { couponSchema } = require("./coupon.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(couponSchema.create),
  couponController.create
);

router.get("/all", couponController.getAll);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(couponSchema.update),
  couponController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  couponController.delete
);

module.exports = router;
