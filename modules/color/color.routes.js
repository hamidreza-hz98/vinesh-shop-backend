const express = require("express");
const { colorController } = require("./color.controller");
const { colorSchema } = require("./color.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(colorSchema.create), colorController.create);

router.get("/all", colorController.getAll);

router.post("/:id", validate(colorSchema.update), colorController.update);

router.delete("/:id", colorController.delete);

module.exports = router;
