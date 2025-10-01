const express = require("express");
const { campaignController } = require("./campaign.controller");
const { campaignSchema } = require("./campaign.validation");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post("/", validate(campaignSchema.create), campaignController.create);

router.get("/all", campaignController.getAll);

router.get("/details", campaignController.getDetails);

router.post("/:id", validate(campaignSchema.update), campaignController.update);

router.delete("/:id", campaignController.delete);

module.exports = router;
