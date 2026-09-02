import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const productIdValidator = body("productId")
  .notEmpty()
  .withMessage("Product id is required")
  .isMongoId()
  .withMessage("Invalid product id format");

export const addProductValidator = [productIdValidator, validatorMiddleware];

export const removeProductValidator = [productIdValidator, validatorMiddleware];
