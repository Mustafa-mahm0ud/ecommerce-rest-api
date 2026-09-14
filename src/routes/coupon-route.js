import express from "express";

import { protect, allowedTo } from "../middlewares/auth-middleware.js";
import * as couponController from "../controllers/coupon-controller.js";
import * as couponValidator from "../utils/validators/coupon-validator.js";
import attachCurrentCoupon from "../middlewares/attach-current-coupon.js";

const router = express.Router();

router.use(protect, allowedTo("admin"));

router
  .route("/")
  .get(couponController.getCoupons)
  .post(couponValidator.createCouponValidator, couponController.createCoupon);

router
  .route("/:id")
  .get(couponValidator.getCouponValidator, couponController.getCoupon)
  .patch(
    attachCurrentCoupon,
    couponValidator.updateCouponValidator,
    couponController.updateCoupon,
  )
  .delete(couponValidator.deleteCouponValidator, couponController.deleteCoupon);

export default router;
