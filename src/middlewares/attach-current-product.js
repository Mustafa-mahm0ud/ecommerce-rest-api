import asyncHandler from "express-async-handler";

import productModel from "../models/product-model.js";
import ApiError from "../utils/api-error.js";

const attachCurrentProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel
    .findOne({ _id: req.params.id })
    .select("category imageCover price discountPercentage");

  if (!product)
    throw new ApiError(`No product found with id: ${req.params.id}`, 404);

  req.currentProduct = product;
  next();
});

export default attachCurrentProduct;
