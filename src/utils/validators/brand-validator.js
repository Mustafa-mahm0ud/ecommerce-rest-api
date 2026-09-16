import { param } from "express-validator";

import ALLOWED_BRAND_FIELDS from "../constants/brand-fields.js";
import requireAtLeastOneField from "../require-at-least-one-field.js";
import requiredOrOptional from "../../helpers/required-or-optional.js";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const nameValidator = (isRequired = false) =>
  requiredOrOptional("name", isRequired, "You must enter the name")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32");

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),

  validatorMiddleware,
];

export const createBrandValidator = [nameValidator(true), validatorMiddleware];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),

  requireAtLeastOneField(ALLOWED_BRAND_FIELDS),

  nameValidator(),

  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),

  validatorMiddleware,
];
