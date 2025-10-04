const express = require("express")
const { blogController } = require("./blog.controller")
const { blogSchema } = require("./blog.validation")
const validate = require("../../middlewares/validate")

const router = express.Router()

router.post("/", validate(blogSchema.create), blogController.create);

router.get("/all", blogController.getAll);

router.get("/details", blogController.getDetails)

router.post("/:id", validate(blogSchema.update), blogController.update);

router.delete("/:id", blogController.delete)

module.exports = router