const express = require("express");
const { brandController } = require("./brand.controller");
const { brandSchema } = require("./brand.validation");
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
  validate(brandSchema.create),
  brandController.create
);

router.get("/all", brandController.getAll);

router.get("/details", brandController.getDetails);

router.put(
  "/:id",
  authenticate,
  allowRoles("admin"),
  validate(brandSchema.update),
  brandController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin"),
  brandController.delete
);
module.exports = router;
