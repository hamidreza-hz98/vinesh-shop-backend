const express = require("express");
const { sizeController } = require("./size.controller");
const { sizeSchema } = require("./size.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");

const router = express.Router();

router.post("/", authenticate, allowRoles("admin"), validate(sizeSchema.create), sizeController.create);

router.get("/all", sizeController.getAll);

router.put("/:id", authenticate, allowRoles("admin"), validate(sizeSchema.update), sizeController.update);

router.delete("/:id", authenticate, allowRoles("admin"), sizeController.delete);

module.exports = router;
