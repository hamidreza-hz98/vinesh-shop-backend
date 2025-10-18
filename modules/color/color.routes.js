const express = require("express");
const { colorController } = require("./color.controller");
const { colorSchema } = require("./color.validation");
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
  allowRoles("admin"),
  validate(colorSchema.create),
  colorController.create
);

router.get("/all", colorController.getAll);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin"),
  validate(colorSchema.update),
  colorController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin"),
  colorController.delete
);

module.exports = router;
