import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

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
  nameValidator(),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
