const express = require("express");
const { adminController } = require("./admin.controller");
const { adminSchema } = require("./admin.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(adminSchema.create), adminController.create);

router.get("/details", adminController.getDetails);

router.get("/all", adminController.getAll);

router.post("/login", validate(adminSchema.login), adminController.login);

router.post(
  "/change-password",
  validate(adminSchema.changePassword),
  adminController.changePassword
);

router.delete("/:id", adminController.delete);

router.post("/:id", validate(adminSchema.update), adminController.update);

module.exports = router;
