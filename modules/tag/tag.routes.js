const express = require("express");
const { tagController } = require("./tag.controller");
const { tagSchema } = require("./tag.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");


const router = express.Router();

router.post("/", authenticate, allowRoles("superadmin") ,validate(tagSchema.create), tagController.create);

router.get("/all", tagController.getAll);

router.post("/:id", authenticate, allowRoles("superadmin") ,validate(tagSchema.update), tagController.update);

router.delete("/:id", authenticate, allowRoles("superadmin") ,tagController.delete);

module.exports = router;
