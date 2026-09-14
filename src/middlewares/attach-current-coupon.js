import asyncHandler from "express-async-handler";
import ApiError from "../utils/api-error.js";
import couponModel from "../models/coupon-model.js";

const attachCurrentCoupon = asyncHandler(async (req, res, next) => {
  const { discountType, discountValue, maxDiscount, startDate, expire } =
    req.body;

  const needOldData =
    discountType !== undefined ||
    discountValue !== undefined ||
    maxDiscount !== undefined ||
    startDate !== undefined ||
    expire !== undefined;

  if (!needOldData) return next();

  const coupon = await couponModel
    .findById(req.params.id)
    .select("discountType maxDiscount startDate expire");

  if (!coupon) {
    return next(new ApiError(`No coupon found with id ${req.params.id}`, 404));
  }

  req.currentCoupon = coupon;
  next();
});

export default attachCurrentCoupon;
