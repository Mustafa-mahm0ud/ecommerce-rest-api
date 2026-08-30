import asyncHandler from "express-async-handler";

import * as factory from "./crud-controller.js";
import * as productService from "../services/database/product-service.js";

const ALLOWED_PRODUCT_FIELDS = [
  "title",
  "description",
  "quantity",
  "price",
  "discountPercentage",
  "imageCover",
  "category",
  "subCategories",
  "brand",
];

const ALLOWED_PRODUCT_CREATE_FIELDS = [...ALLOWED_PRODUCT_FIELDS, "images"];

const populateOptions = {
  path: "category brand subCategories",
  select: "name slug",
};

/**
 *@desc        Get Products
 *@route       GET /api/v1/products
 *@access      Public
 */
export const getProducts = factory.getDocs(productService);

/**
 *@desc        Get Specific Product
 *@route       GET /api/v1/products/:id
 *@access      Public
 */
export const getProduct = factory.getDoc(productService, populateOptions);

/**
 *@desc        Create Product (You can upload the imageCover and images here all at once. )
 *@route       POST /api/v1/products
 *@access      Private
 */
export const createProduct = factory.create(
  ALLOWED_PRODUCT_CREATE_FIELDS,
  productService,
);

/**
 *@desc        Update Product (You can edit the fields and cover photo from here)
 *@route       PATCH /api/v1/products/:id
 *@access      Private
 */
export const updateProduct = factory.update(
  ALLOWED_PRODUCT_FIELDS,
  productService,
  "imageCover",
  "products",
);
/**
 *@desc        Delete Product
 *@route       DELETE /api/v1/products/:id
 *@access      Private
 */
export const deleteProduct = factory.del(
  productService,
  ["imageCover", "images"],
  "products",
);

/**
 *@desc         Add Image (Used to add image to the images field)
 *@route        POST /api/v1/products/:id/images
 *@access       Private
 */
export const addProductImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const doc = await productService.addImage(
    id,
    req.body.images,
    req.processedImages,
  );

  res.status(200).json({ status: "success", data: doc });
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
