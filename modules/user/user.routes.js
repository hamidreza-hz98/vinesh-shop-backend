const express = require("express");
const { userController } = require("./user.controller");
const { userSchema } = require("./user.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(userSchema.create), userController.create);

router.get("/details", userController.getDetails);

router.get("/all", userController.getAll);

router.post("/signup", validate(userSchema.create), userController.signup);

router.post("/login", validate(userSchema.login), userController.login);

router.post(
  "/change-password",
  validate(userSchema.changePassword),
  userController.changePassword
);

router.delete("/:id", userController.delete);

router.post("/:id", validate(userSchema.update), userController.update);

module.exports = router;
