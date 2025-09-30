const express = require("express");
const { tagController } = require("./tag.controller");
const { tagSchema } = require("./tag.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(tagSchema.create), tagController.create);

router.get("/all", tagController.getAll);

router.post("/:id", validate(tagSchema.update), tagController.update);

router.delete("/:id", tagController.delete);

module.exports = router;
