const express = require("express");
const router = express.Router();

const userRoutes = require("./user/user.routes");
const adminRoutes = require("./admin/admin.routes");

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
