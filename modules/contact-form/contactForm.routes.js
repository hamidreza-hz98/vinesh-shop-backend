const express = require("express");
const { contactFormController } = require("./contactForm.controller");
const { contactFormSchema } = require("./contactForm.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post(
  "/",
  validate(contactFormSchema.create),
  contactFormController.create
);

router.get("/all", contactFormController.getAll);

router.post(
  "/:id",
  validate(contactFormSchema.update),
  contactFormController.update
);

router.delete("/:id", contactFormController.delete);

module.exports = router;
