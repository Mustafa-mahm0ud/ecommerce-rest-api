import { param, body } from "express-validator";

import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

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

  nameValidator(),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  param("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
