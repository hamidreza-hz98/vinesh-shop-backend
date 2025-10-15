const express = require("express");
const { categoryController } = require("./category.controller");
const { categorySchema } = require("./category.validation");
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
  validate(categorySchema.create),
  categoryController.create
);

router.get("/all", categoryController.getAll);

router.get("/details", categoryController.getDetails);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(categorySchema.update),
  categoryController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  categoryController.delete
);

module.exports = router;
