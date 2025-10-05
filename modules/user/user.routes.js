const express = require("express");
const { userController } = require("./user.controller");
const { userSchema } = require("./user.validation");
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
  validate(userSchema.create),
  userController.create
);

router.get("/details", userController.getDetails);

router.get("/all", authenticate, allowRoles("viewer"), userController.getAll);

router.post("/signup", validate(userSchema.create), userController.signup);

router.post("/login", validate(userSchema.login), userController.login);

router.post(
  "/change-password",
  validate(userSchema.changePassword),
  userController.changePassword
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("superadmin"),
  userController.delete
);

router.post(
  "/:id",
  authenticate,
  allowRoles("superadmin", "user"),
  validate(userSchema.update),
  userController.update
);

module.exports = router;
