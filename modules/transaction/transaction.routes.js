const express = require("express");
const { transactionController } = require("./transaction.controller");
const { transactionSchema } = require("./transaction.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(transactionSchema.create),
  transactionController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  transactionController.getAll
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(transactionSchema.update),
  transactionController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  transactionController.delete
);

module.exports = router;
