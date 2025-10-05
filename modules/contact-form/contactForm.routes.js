const express = require("express");
const { contactFormController } = require("./contactForm.controller");
const { contactFormSchema } = require("./contactForm.validation");
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
  validate(contactFormSchema.create),
  contactFormController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  contactFormController.getAll
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(contactFormSchema.update),
  contactFormController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  contactFormController.delete
);

module.exports = router;
