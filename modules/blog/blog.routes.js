const express = require("express");
const { blogController } = require("./blog.controller");
const { blogSchema } = require("./blog.validation");
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
  validate(blogSchema.create),
  blogController.create
);

router.get("/all", blogController.getAll);

router.get("/details", blogController.getDetails);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin"),
  validate(blogSchema.update),
  blogController.update
);

router.delete("/:id", authenticate, allowRoles("admin"), blogController.delete);

module.exports = router;
