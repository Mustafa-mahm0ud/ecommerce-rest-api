import couponModel from "../../models/coupon-model.js";
import ApiError from "../../utils/api-error.js";

import * as factory from "./crud-service.js";

const crudConfig = { Model: couponModel, modelName: "Coupon" };

export const getDocs = factory.getDocs({
  Model: couponModel,
  defaultFields:
    "code discountType discountValue maxDiscount startDate minOrderValue maxUses expire isActive",
});
export const getDoc = factory.getDoc(crudConfig);
export const create = factory.create(crudConfig);
export const del = factory.del(crudConfig);

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
