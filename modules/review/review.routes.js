const express = require("express");
const { reviewController } = require("./review.controller");
const { reviewSchema } = require("./review.validation");
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
  validate(reviewSchema.create),
  reviewController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  reviewController.getAll
);

router.put(
  "/:id",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  validate(reviewSchema.update),
  reviewController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  reviewController.delete
);

module.exports = router;
