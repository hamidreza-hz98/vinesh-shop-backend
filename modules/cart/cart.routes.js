const express = require("express");
const { cartController } = require("./cart.controller");
const { cartSchema } = require("./cart.validation");
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
  allowRoles("user"),
  validate(cartSchema.create),
  cartController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("superadmin"),
  cartController.getAll
);

router.post(
  "/:id",
  authenticate,
  allowRoles("user"),
  validate(cartSchema.update),
  cartController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("superadmin", "user"),
  cartController.delete
);

module.exports = router;
