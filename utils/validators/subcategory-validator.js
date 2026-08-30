import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

const nameValidator = (isRequired = false) =>
  requiredOrOptional("name", isRequired, "You must enter the subcategory name")
    .isLength({ min: 2, max: 32 })
    .withMessage("name must be between 2 and 32");

export const getSubCategoriesValidator = [
  param("categoryId").isMongoId().withMessage("Invalid category id format"),

  validatorMiddleware,
];

export const getSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory id format"),

  validatorMiddleware,
];

export const createSubCategoryValidator = [
  param("categoryId").isMongoId().withMessage("Invalid category id format"),

  nameValidator(true),

  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory id format"),

  nameValidator(),

  body("category").optional().isMongoId().withMessage("Invalid category id"),

  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid subcategory id format"),

  validatorMiddleware,
];
