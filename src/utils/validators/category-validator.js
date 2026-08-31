import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isUpdate, msg) =>
  isUpdate
    ? body(field).trim().optional()
    : body(field).trim().notEmpty().withMessage(msg);

const nameValidator = (isUpdate = false) =>
  requiredOrOptional("name", isUpdate, "You must enter the name")
    .isLength({ min: 3, max: 32 })
    .withMessage("Category name must be between 3 and 32");

export const getCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

export const createCategoryValidator = [nameValidator(), validatorMiddleware];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),
  nameValidator(true),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
