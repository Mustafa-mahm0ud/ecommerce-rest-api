import { param, body } from "express-validator";

import ALLOWED_COUPON_FIELDS from "../constants/coupon-fields.js";
import requireAtLeastOneField from "../require-at-least-one-field.js";
import requiredOrOptional from "../../helpers/required-or-optional.js";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const preventUpdateIfUsed =
  (fieldName) =>
  (_, { req }) => {
    if (!req.currentCoupon) return true;

    if (req.currentCoupon.usedBy.length)
      throw new Error(
        `The ${fieldName} cannot be modified because it has been used by users`,
      );
    return true;
  };

const codeValidator = (isRequired = false) =>
  requiredOrOptional("code", isRequired, "You must enter the coupon code")
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters");

const discountTypeValidator = (isRequired = false) =>
  requiredOrOptional(
    "discountType",
    isRequired,
    "You must enter the discount type",
  )
    .custom(preventUpdateIfUsed("discount type"))
    .isIn(["percentage", "fixed"])
    .withMessage("Discount type must be either percentage or fixed");

const discountValueValidator = (isRequired = false) =>
  requiredOrOptional(
    "discountValue",
    isRequired,
    "You must enter the discount value",
  )
    .custom(preventUpdateIfUsed("discount value"))
    .isFloat({ min: 1 })
    .withMessage("Discount value must be at least 1")
    .toFloat()
    .custom((value, { req }) => {
      if (
        (req.body.discountType || req.currentCoupon?.discountType) ===
          "percentage" &&
        (value || req.currentCoupon.discountValue) > 100
      ) {
        throw new Error("Percentage discount can't exceed 100");
      }
      return true;
    });

const maxDiscountValidator = () => [
  body("maxDiscount")
    .if((_, { req }) => req.body.discountType === "percentage")
    .notEmpty()
    .withMessage("Max discount is required for percentage discounts"),

  body("maxDiscount")
    .if(
      (_, { req }) =>
        (req.body.discountType || req.currentCoupon?.discountType) === "fixed",
    )
    .isEmpty()
    .withMessage("Max discount is not allowed for fixed discounts"),

  body("maxDiscount")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Max discount must be at least 1")
    .toFloat(),
];

const startDateValidator = () =>
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .toDate()
    .custom((value, { req }) => {
      const expire = req.body.expire ?? req.currentCoupon?.expire;

      if (expire && new Date(value) >= new Date(expire)) {
        throw new Error("Start date must be before the expiration date");
      }

      return true;
    });

const minOrderValueValidator = () =>
  body("minOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order value can't be negative")
    .toFloat();

const maxUsesValidator = () =>
  body("maxUses")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max uses must be at least 1")
    .toInt();

const expireValidator = (isRequired = false) =>
  requiredOrOptional("expire", isRequired, "You must enter the expiration date")
    .isISO8601()
    .withMessage("Expiration date must be a valid date")
    .toDate()
    .custom((value, { req }) => {
      const startDate =
        req.body.startDate || req.currentCoupon?.startDate
          ? new Date(req.body.startDate || req.currentCoupon?.startDate)
          : new Date();

      if (new Date(value) <= startDate) {
        throw new Error("Expiration date must be after the start date");
      }

      return true;
    });

const isActiveValidator = () =>
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean();

const couponIdParamValidator = () =>
  param("id").isMongoId().withMessage("Invalid coupon id format");

export const getCouponValidator = [
  couponIdParamValidator(),

  validatorMiddleware,
];

export const createCouponValidator = [
  codeValidator(true),
  discountTypeValidator(true),
  discountValueValidator(true),
  ...maxDiscountValidator(),
  startDateValidator(),
  minOrderValueValidator(),
  maxUsesValidator(),
  expireValidator(true),
  isActiveValidator(),

  validatorMiddleware,
];

export const updateCouponValidator = [
  couponIdParamValidator(),

  requireAtLeastOneField(ALLOWED_COUPON_FIELDS),

  codeValidator(),
  discountTypeValidator(),
  discountValueValidator(),
  ...maxDiscountValidator(),
  startDateValidator(),
  minOrderValueValidator(),
  maxUsesValidator(),
  expireValidator(),
  isActiveValidator(),

  validatorMiddleware,
];

export const deleteCouponValidator = [
  couponIdParamValidator(),

  validatorMiddleware,
];
