const express = require("express");
const router = express.Router();

const userRoutes = require("./user/user.routes");
const adminRoutes = require("./admin/admin.routes");
const mediaRoutes = require("./media/media.routes");

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/media", mediaRoutes);

module.exports = router;
