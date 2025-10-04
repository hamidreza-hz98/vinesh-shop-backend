const express = require("express");
const { orderController } = require("./order.controller");
const { orderSchema } = require("./order.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(orderSchema.create), orderController.create);

router.get("/all", orderController.getAll);

router.post("/:id", validate(orderSchema.update), orderController.update);

router.get("/user/details", orderController.getUserOrderDetails);

router.get("/details/:id", orderController.getDetails);

router.delete("/:id", orderController.delete);

router.get("/user/:userId", orderController.getUserOrders);

module.exports = router;
