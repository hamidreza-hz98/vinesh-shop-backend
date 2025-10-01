const express = require("express");
const router = express.Router();

const userRoutes = require("./user/user.routes");
const adminRoutes = require("./admin/admin.routes");
const mediaRoutes = require("./media/media.routes");
const tagRoutes = require("./tag/tag.routes");
const sizeRoutes = require("./size/size.routes");
const colorRoutes = require("./color/color.routes");
const categoryRoutes = require("./category/category.routes");
const brandRoutes = require("./brand/brand.routes");
const productRoutes = require("./product/product.routes");
const cartRoutes = require("./cart/cart.routes");
const couponRoutes = require("./coupon/coupon.routes");
const addressRoutes = require("./address/address.routes");

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/media", mediaRoutes);
router.use("/tag", tagRoutes);
router.use("/size", sizeRoutes);
router.use("/color", colorRoutes);
router.use("/category", categoryRoutes);
router.use("/brand", brandRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/coupon", couponRoutes);
router.use("/address", addressRoutes);

module.exports = router;
