/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag management APIs
 */

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *     description: Accessible by superadmin
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               translations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     lang:
 *                       type: string
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *     responses:
 *       200:
 *         description: Tag created successfully
 */


const express = require("express");
const { tagController } = require("./tag.controller");
const { tagSchema } = require("./tag.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");


const router = express.Router();

router.post("/", authenticate, allowRoles("superadmin") ,validate(tagSchema.create), tagController.create);

router.get("/all", tagController.getAll);

router.post("/:id", authenticate, allowRoles("superadmin") ,validate(tagSchema.update), tagController.update);

router.delete("/:id", authenticate, allowRoles("superadmin") ,tagController.delete);

module.exports = router;
