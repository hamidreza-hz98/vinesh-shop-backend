const express = require("express");
const { reviewController } = require("./review.controller");
const { reviewSchema } = require("./review.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(reviewSchema.create), reviewController.create);

router.get("/all", reviewController.getAll);

router.put("/:id", validate(reviewSchema.update), reviewController.update);

router.delete("/:id", reviewController.delete);

module.exports = router;
