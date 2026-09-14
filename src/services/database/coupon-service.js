import couponModel from "../../models/coupon-model.js";
import ApiError from "../../utils/api-error.js";

import * as factory from "./crud-service.js";

export const getDocs = factory.getDocs(
  couponModel,
  "code discountType discountValue maxDiscount startDate minOrderValue maxUses expire isActive",
);
export const getDoc = factory.getDoc(couponModel);
export const create = factory.create(couponModel);
export const del = factory.del(couponModel);

export const update = async (id, fieldsToUpdate) => {
  const coupon = await couponModel.findById(id);

  if (!coupon) {
    throw new ApiError(`No document found with id: ${id}`, 404);
  }

  coupon.set(fieldsToUpdate);

  if (coupon.discountType === "fixed") {
    coupon.maxDiscount = undefined;
  }

  await coupon.save();

  return coupon;
};
