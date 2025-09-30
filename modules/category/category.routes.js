const express = require("express");
const { categoryController } = require("./category.controller");
const { categorySchema } = require("./category.validation");
const validate = require("../../middlewares/validate");
const router = express.Router();

router.post("/", validate(categorySchema.create), categoryController.create);

router.get("/all", categoryController.getAll);

router.get("/details", categoryController.getDetails)

router.post("/:id", validate(categorySchema.update), categoryController.update);

router.delete("/:id", categoryController.delete)

module.exports = router;
