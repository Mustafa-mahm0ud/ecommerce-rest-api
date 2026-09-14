import * as factory from "./crud-controller.js";
import * as couponService from "../services/database/coupon-service.js";
import ALLOWED_COUPON_FIELDS from "../utils/constants/coupon-fields.js";

const populateOptions = { path: "usedBy", select: "name email phone" };

export const getCoupons = factory.getDocs(couponService);
export const getCoupon = factory.getDoc(couponService, populateOptions);
export const createCoupon = factory.create(
  ALLOWED_COUPON_FIELDS,
  couponService,
);
export const updateCoupon = factory.update(
  ALLOWED_COUPON_FIELDS,
  couponService,
);
export const deleteCoupon = factory.del(couponService);
