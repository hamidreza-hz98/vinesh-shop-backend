const express = require("express");
const { adminController } = require("./admin.controller");
const { adminSchema } = require("./admin.validation");
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
  allowRoles("superadmin"),
  validate(adminSchema.create),
  adminController.create
);

router.get(
  "/details",
  authenticate,
  allowRoles("superadmin"),
  adminController.getDetails
);

router.get(
  "/all",
  authenticate,
  allowRoles("superadmin"),
  adminController.getAll
);

router.post("/login", validate(adminSchema.login), adminController.login);

router.post(
  "/change-password",
  validate(adminSchema.changePassword),
  adminController.changePassword
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("superadmin"),
  adminController.delete
);

router.post(
  "/:id",
  authenticate,
  allowRoles("superadmin"),
  validate(adminSchema.update),
  adminController.update
);

module.exports = router;
