const express = require("express");
const { cartController } = require("./cart.controller");
const { cartSchema } = require("./cart.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(cartSchema.create), cartController.create);

router.get("/all", cartController.getAll);

router.post("/:id", validate(cartSchema.update), cartController.update);

router.delete("/:id", cartController.delete);

module.exports = router;
