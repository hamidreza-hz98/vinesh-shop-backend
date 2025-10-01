const express = require("express");
const { addressController } = require("./address.controller");
const { addressSchema } = require("./address.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(addressSchema.create), addressController.create);

router.get("/all", addressController.getAll);

router.post("/:id", validate(addressSchema.update), addressController.update);

router.get("/:id", addressController.getDetails);

router.delete("/:id", addressController.delete);

router.get("/user/:userId", addressController.getUserAddresses);

router.get("/:id/user/:userId", addressController.getUserAddressDetails);

router.post("/:id/user/:userId", addressController.makeDefault);

module.exports = router;
