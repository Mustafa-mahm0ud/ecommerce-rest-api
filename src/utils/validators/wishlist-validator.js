import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

export const addProductValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product id is required")
    .isMongoId()
    .withMessage("Invalid product id format"),

  validatorMiddleware,
];

export const removeProductValidator = [
  param("productId").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];
