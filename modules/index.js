const express = require("express");
const router = express.Router();

const userRoutes = require("./user/user.routes");
const adminRoutes = require("./admin/admin.routes");
const mediaRoutes = require("./media/media.routes");
const tagRoutes = require("./tag/tag.routes");
const sizeRoutes = require("./size/size.routes");
const colorRoutes = require("./color/color.routes");

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/media", mediaRoutes);
router.use("/tag", tagRoutes);
router.use("/size", sizeRoutes);
router.use("/color", colorRoutes);

module.exports = router;
