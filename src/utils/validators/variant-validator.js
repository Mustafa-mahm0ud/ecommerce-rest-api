import { body, param } from "express-validator";

import { ALLOWED_VARIANT_UPDATE_FIELDS } from "../constants/variant-fields.js";
import requiredOrOptional from "../../helpers/required-or-optional.js";
import requireAtLeastOneField from "../require-at-least-one-field.js";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const productIdParam = () =>
  param("productId").isMongoId().withMessage("Invalid product id");

const variantIdParam = () =>
  param("variantId").isMongoId().withMessage("Invalid variant id");

const colorValidator = () =>
  body("color")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Color can't be empty")
    .toLowerCase();

const sizeValidator = () =>
  body("size")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Size can't be empty")
    .toUpperCase();

const quantityValidator = (isRequired = false) =>
  requiredOrOptional("quantity", isRequired, "Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be an integer >= 0")
    .toInt();

const isAvailableValidator = () =>
  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be a boolean value")
    .toBoolean();

export const addVariantValidator = [
  productIdParam(),
  colorValidator(),
  sizeValidator(),
  quantityValidator(true),
  isAvailableValidator(),

  validatorMiddleware,
];

export const updateVariantValidator = [
  productIdParam(),
  variantIdParam(),

  requireAtLeastOneField(ALLOWED_VARIANT_UPDATE_FIELDS),

  isAvailableValidator(),
  quantityValidator(),

  validatorMiddleware,
];
