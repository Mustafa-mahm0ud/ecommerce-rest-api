import couponModel from "../../models/coupon-model.js";
import ApiError from "../../utils/api-error.js";

import * as factory from "./crud-service.js";

export const getDocs = factory.getDocs({
  Model: couponModel,
  defaultFields:
    "code discountType discountValue maxDiscount startDate minOrderValue maxUses expire isActive",
});
export const getDoc = factory.getDoc({
  Model: couponModel,
  modelName: "Coupon",
});
export const create = factory.create({
  Model: couponModel,
  modelName: "Coupon",
});
export const del = factory.del({ Model: couponModel, modelName: "Coupon" });

export const update = async ({ id, fieldsToUpdate }) => {
  const coupon = await couponModel.findById(id);

  if (!coupon) {
    throw new ApiError(`Coupon not found`, 404);
  }

  coupon.set(fieldsToUpdate);

  if (coupon.discountType === "fixed") {
    coupon.maxDiscount = undefined;
  }

  await coupon.save();

  return coupon;
};
