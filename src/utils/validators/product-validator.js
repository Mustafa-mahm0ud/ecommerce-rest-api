import { param, body } from "express-validator";
import mongoose from "mongoose";

import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

const titleValidator = (isRequired = false) =>
  requiredOrOptional("title", isRequired, "You must enter the title")
    .isLength({ min: 3, max: 500 })
    .withMessage("product title must be between 3 and 500");

const descriptionValidator = (isRequired = false) =>
  requiredOrOptional(
    "description",
    isRequired,
    "You must enter the description",
  )
    .isLength({ min: 20, max: 2000 })
    .withMessage("Product description must be between 20 and 2000");

const quantityValidator = (isRequired = false) =>
  requiredOrOptional("quantity", isRequired, "You must enter the quantity")
    .isInt({ min: 1 })
    .withMessage("Product quantity must be at least one");

const priceValidator = (isRequired = false) =>
  requiredOrOptional("price", isRequired, "You must enter the price")
    .isFloat({ min: 0.01, max: 1e6 })
    .withMessage("Price must be between 0.01 and 1,000,000")
    .toFloat();

const discountPercentageValidator = () =>
  body("discountPercentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100");

const colorsValidator = () => [
  body("colors").optional().isArray().withMessage("colors must be an array"),
  body("colors.*").isString().withMessage("each color must be a string"),
];

const imagesValidator = (isRequired = false) =>
  body("images")
    .optional()
    .custom((val, { req }) => {
      if (isRequired && !req.files?.images?.length)
        throw new Error("You must upload at least one image");

      if (req.files?.images?.length > 5)
        throw new Error("images field cannot exceed 5 photos");

      return true;
    });

const categoryValidator = (isRequired = false) =>
  requiredOrOptional(
    "category",
    isRequired,
    "Product must be belong to parent category",
  )
    .isMongoId()
    .withMessage("Invalid category id format");

const subCategoriesValidator = () =>
  body("subCategories")
    .optional()
    .isArray({ min: 1 })
    .withMessage("subCategories must be a non-empty array")
    .custom((ids) => {
      const isValidIds = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
      if (!isValidIds) throw new Error("Invalid subCategories ids format");

      const uniqueIds = new Set(ids);
      if (uniqueIds.size !== ids.length)
        throw new Error("Duplicate subCategories ids are not allowed");

      return true;
    });

const brandValidator = () =>
  body("brand").optional().isMongoId().withMessage("Invalid brand id format");

export const getProductValidator = [
  param("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];

export const createProductValidator = [
  titleValidator(true),
  descriptionValidator(true),
  quantityValidator(true),
  priceValidator(true),
  discountPercentageValidator(),
  ...colorsValidator(),
  imagesValidator(),
  categoryValidator(true),
  subCategoriesValidator(),
  brandValidator(),

  body("imageCover").custom((val, { req }) => {
    if (!req.files?.imageCover)
      throw new Error("You must enter the image Cover");

    if (req.files.imageCover.length > 1)
      throw new Error("imageCover must contain exactly one image");

    return true;
  }),

  validatorMiddleware,
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product id format"),

  titleValidator(),
  descriptionValidator(),
  quantityValidator(),
  priceValidator(),
  discountPercentageValidator(),
  ...colorsValidator(),
  categoryValidator(),
  subCategoriesValidator(),
  brandValidator(),

  validatorMiddleware,
];

export const deleteProductValidator = [
  param("id").isMongoId().withMessage("Invalid product id format"),

  validatorMiddleware,
];

export const deleteProductImageValidator = [
  param("id").isMongoId().withMessage("Invalid product id format"),

  param("imageName")
    .isString()
    .withMessage("Image name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Image name is required"),

  validatorMiddleware,
];

export const addProductImagesValidator = [
  param("id").isMongoId().withMessage("Invalid product id format"),

  imagesValidator(true),

  validatorMiddleware,
];
