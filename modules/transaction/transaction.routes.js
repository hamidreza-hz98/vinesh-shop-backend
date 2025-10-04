const express = require("express");
const { transactionController } = require("./transaction.controller");
const { transactionSchema } = require("./transaction.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post(
  "/",
  validate(transactionSchema.create),
  transactionController.create
);

router.get("/all", transactionController.getAll);

router.post(
  "/:id",
  validate(transactionSchema.update),
  transactionController.update
);

router.delete("/:id", transactionController.delete);

module.exports = router;
