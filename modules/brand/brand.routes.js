const express = require("express");
const { brandController } = require("./brand.controller");
const { brandSchema } = require("./brand.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(brandSchema.create), brandController.create);

router.get("/all", brandController.getAll);

router.get("/details", brandController.getDetails);

router.post("/:id", validate(brandSchema.update), brandController.update);

router.delete("/:id", brandController.delete);
module.exports = router;
