import asyncHandler from "express-async-handler";

import * as productService from "../services/database/product-service.js";

import {
  ALLOWED_PRODUCT_CREATE_FIELDS,
  ALLOWED_PRODUCT_UPDATE_FIELDS,
} from "../utils/constants/product-fields.js";
import { ALLOWED_VARIANT_CREATE_FIELDS } from "../utils/constants/variant-fields.js";
import pickAllowedFields from "../helpers/pick-allowed-fields.js";

import { deleteOldSingleImage } from "../services/storage/local-storage/delete-files.js";

const populateOptions = {
  path: "category brand subCategories",
  select: "name slug",
};

/**
 *@desc        Get Products
 *@route       GET /api/v1/products
 *@access      Public
 */
export const getProducts = asyncHandler(async (req, res, next) => {
  const { docs, paginationResult } = await productService.getDocs(
    req.sanitizedQuery,
    {
      select:
        "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
    },
  );

  res.status(200).json({
    status: "success",
    results: docs.length,
    paginationResult,
    data: docs,
  });
});

/**
 *@desc        Get Specific Product
 *@route       GET /api/v1/products/:id
 *@access      Public
 */
export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const doc = await productService.getDoc(id, { populateOptions });

  res.status(200).json({ status: "success", data: doc });
});

/**
 *@desc        Create Product (You can upload the imageCover and images here all at once. )
 *@route       POST /api/v1/products
 *@access      Private
 */
export const createProduct = asyncHandler(async (req, res, next) => {
  const fieldsToCreate = pickAllowedFields(
    ALLOWED_PRODUCT_CREATE_FIELDS,
    req.body,
  );

  fieldsToCreate.variants = fieldsToCreate.variants.map((variant) =>
    pickAllowedFields(ALLOWED_VARIANT_CREATE_FIELDS, variant),
  );

  const doc = await productService.create({
    fieldsToCreate,
    processedImage: req.processedImage,
    processedImages: req.processedImages,
  });

  res.status(201).json({ status: "success", data: doc });
});

/**
 *@desc        Update Product (You can edit the fields and cover photo from here)
 *@route       PATCH /api/v1/products/:productId
 *@access      Private
 */
export const updateProduct = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = pickAllowedFields(
    ALLOWED_PRODUCT_UPDATE_FIELDS,
    req.body,
  );

  const doc = await productService.update({
    productId: req.params.productId,
    fieldsToUpdate,
    currentProduct: req.currentProduct,
    processedImage: req.processedImage,
  });

  res.status(200).json({ status: "success", data: doc });

  res.on("finish", () => {
    const oldValue = req.currentProduct.imageCover;
    const newValue = doc.imageCover;

    deleteOldSingleImage(oldValue, newValue, "products");
  });
});

/**
 *@desc        Delete Product
 *@route       DELETE /api/v1/products/:productId
 *@access      Private
 */
export const deleteProduct = asyncHandler(async (req, res, next) => {
  await productService.del(req.params.productId);

  res.status(204).send();
});

/**
 *@desc         Add Image (Used to add image to the images field)
 *@route        POST /api/v1/products/:id/images
 *@access       Private
 */
export const addProductImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  await productService.addImage(id, req.body.images, req.processedImages);

  res.status(204).send();
});

/**
 *@desc         Delete Image (Used to remove image from the images field)
 *@route        DELETE /api/v1/products/:id/images/:imageName
 *@access       Private
 */
export const deleteProductImage = asyncHandler(async (req, res, next) => {
  const { id, imageName } = req.params;

  await productService.deleteImage(id, "images", "products", imageName);

  res.status(204).send();
});
