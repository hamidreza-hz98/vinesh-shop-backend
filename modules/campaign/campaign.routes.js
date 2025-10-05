const express = require("express");
const { campaignController } = require("./campaign.controller");
const { campaignSchema } = require("./campaign.validation");
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
  validate(campaignSchema.create),
  campaignController.create
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  campaignController.getAll
);

router.get(
  "/details",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  campaignController.getDetails
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(campaignSchema.update),
  campaignController.update
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  campaignController.delete
);

module.exports = router;
