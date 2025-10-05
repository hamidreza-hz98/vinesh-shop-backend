const express = require("express");
const { productController } = require("./product.controller");
const { productSchema } = require("./product.validation");
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
  validate(productSchema.create),
  productController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  productController.getAll
);

router.get(
  "/details",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  productController.getDetails
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(productSchema.update),
  productController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  productController.delete
);

module.exports = router;
