const express = require("express")
const { productController } = require("./product.controller")
const { productSchema } = require("./product.validation")
const validate = require("../../middlewares/validate")

const router = express.Router()

router.post("/", validate(productSchema.create), productController.create);

router.get("/all", productController.getAll);

router.get("/details", productController.getDetails)

router.post("/:id", validate(productSchema.update), productController.update);

router.delete("/:id", productController.delete)

module.exports = router