const express = require("express");
const { couponController } = require("./coupon.controller");
const { couponSchema } = require("./coupon.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(couponSchema.create), couponController.create);

router.get("/all", couponController.getAll);

router.post("/:id", validate(couponSchema.update), couponController.update);

router.delete("/:id", couponController.delete);

module.exports = router;
