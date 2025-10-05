const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { mediaController } = require("./media.controller");
const { mediaSchema } = require("./media.validation");
const validate = require("../../middlewares/validate");

const {
  authenticate,
  allowRoles,
  requireUser,
  allowUserOrAdmin,
} = require("../../middlewares/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "..", "..", "..", "public", "uploads");

    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      console.error("Error creating upload directory:", dir, err);
      cb(err, dir);
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${baseName}${ext}`);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authenticate,
  allowRoles("user", "admin", "superadmin"),
  upload.single("file"),
  validate(mediaSchema.upload),
  mediaController.upload
);

router.get(
  "/details",
  validate(mediaSchema.getDetails),
  mediaController.getDetails
);

router.get(
  "/all",
  authenticate,
  allowRoles("admin", "superadmin"),
  mediaController.getAll
);

router.delete(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  mediaController.delete
);

router.post(
  "/:id",
  authenticate,
  allowRoles("admin", "superadmin"),
  validate(mediaSchema.update),
  mediaController.update
);

module.exports = router;
