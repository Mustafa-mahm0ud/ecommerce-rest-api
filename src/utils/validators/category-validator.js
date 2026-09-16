import { param } from "express-validator";

import ALLOWED_CATEGORY_FIELDS from "../constants/category-fields.js";
import requireAtLeastOneField from "../require-at-least-one-field.js";
import requiredOrOptional from "../../helpers/required-or-optional.js";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const nameValidator = (isRequired = false) =>
  requiredOrOptional("name", isRequired, "You must enter the name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32");

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleware,
];

export const createCategoryValidator = [
  nameValidator(true),

  validatorMiddleware,
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),

  requireAtLeastOneField(ALLOWED_CATEGORY_FIELDS),

  nameValidator(),

  validatorMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleware,
];
