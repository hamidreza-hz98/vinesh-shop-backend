const express = require("express");
const { addressController } = require("./address.controller");
const { addressSchema } = require("./address.validation");
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
  validate(addressSchema.create),
  addressController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  addressController.getAll
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(addressSchema.update),
  addressController.update
);

router.get(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  addressController.getDetails
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  addressController.delete
);

router.get(
  "/user/:userId",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  addressController.getUserAddresses
);

router.get(
  "/:id/user/:userId",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  addressController.getUserAddressDetails
);

router.post(
  "/:id/user/:userId",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  addressController.makeDefault
);

module.exports = router;
