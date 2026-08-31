import { param, body } from "express-validator";

import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isUpdate, msg) =>
  isUpdate
    ? body(field).trim().optional()
    : body(field).trim().notEmpty().withMessage(msg);

const nameValidator = (isUpdate = false) =>
  requiredOrOptional("name", isUpdate, "You must enter the name")
    .isLength({ min: 2, max: 32 })
    .withMessage("Brand name must be between 2 and 32");

export const getBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];

export const createBrandValidator = [nameValidator(), validatorMiddleware];

export const updateBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),

  nameValidator(true),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
