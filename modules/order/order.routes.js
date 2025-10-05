const express = require("express");
const { orderController } = require("./order.controller");
const { orderSchema } = require("./order.validation");
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
  allowRoles("user", "admin", "superadmin"),
  validate(orderSchema.create),
  orderController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  orderController.getAll
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(orderSchema.update),
  orderController.update
);

router.get(
  "/user/details",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  orderController.getUserOrderDetails
);

router.get(
  "/details/:id",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  orderController.getDetails
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  orderController.delete
);

router.get(
  "/user/:userId",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  orderController.getUserOrders
);

module.exports = router;
