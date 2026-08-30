import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired ? body(field).notEmpty().withMessage(msg) : body(field).optional();

const titleValidator = () =>
  body("title")
    .trim()
    .optional()
    .isLength({ min: 4, max: 400 })
    .withMessage("Title must be between 4 and 400 characters");

const ratingValidator = (isRequired = false) =>
  requiredOrOptional("rating", isRequired, "Rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1.0 and 5.0")
    .toFloat();

export const getReviewsValidator = [
  param("productId").isMongoId().withMessage("Invalid productId format"),

  validatorMiddleware,
];

export const getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),

  validatorMiddleware,
];

export const createReviewValidator = [
  param("productId").isMongoId().withMessage("Invalid product id"),

  titleValidator(),
  ratingValidator(true),

  validatorMiddleware,
];

export const updateReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),

  titleValidator(),
  ratingValidator(),

  validatorMiddleware,
];

export const deleteReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review id"),

  validatorMiddleware,
];
