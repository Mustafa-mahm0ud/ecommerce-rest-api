import * as factory from "./crud-controller.js";
import * as couponService from "../services/database/coupon-service.js";
import ALLOWED_COUPON_FIELDS from "../utils/constants/coupon-fields.js";

export const getCoupons = factory.getDocs({ service: couponService });
export const getCoupon = factory.getDoc({ service: couponService });
export const createCoupon = factory.create({
  service: couponService,
  fieldsToCreate: ALLOWED_COUPON_FIELDS,
});
export const updateCoupon = factory.update({
  service: couponService,
  fieldsToUpdate: ALLOWED_COUPON_FIELDS,
});
export const deleteCoupon = factory.del(couponService);
