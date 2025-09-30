const express = require("express");
const { sizeController } = require("./size.controller");
const { sizeSchema } = require("./size.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(sizeSchema.create), sizeController.create);

router.get("/all", sizeController.getAll);

router.post("/:id", validate(sizeSchema.update), sizeController.update);

router.delete("/:id", sizeController.delete);

module.exports = router;
