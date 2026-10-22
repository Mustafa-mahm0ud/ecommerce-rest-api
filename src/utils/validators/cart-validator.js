import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const mongoIdParam = (name) =>
  param(name).isMongoId().withMessage(`Invalid ${name}`);

export const addItemValidator = [
  mongoIdParam("productId"),
  mongoIdParam("variantId"),
  validatorMiddleware,
];

export const updateQuantityValidator = [
  mongoIdParam("productId"),
  mongoIdParam("variantId"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt()
    .withMessage("Quantity must be an integer")
    .custom((value) => Number(value) !== 0)
    .withMessage("Quantity must not be zero")
    .toInt(),

  validatorMiddleware,
];

export const removeItemValidator = [
  mongoIdParam("itemId"),
  validatorMiddleware,
];
