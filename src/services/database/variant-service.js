import mongoose from "mongoose";

import productModel from "../../models/product-model.js";
import ApiError from "../../utils/api-error.js";

export const addVariant = async ({ productId, variantData }) => {
  const { color = null, size = null } = variantData;
  const variantId = new mongoose.Types.ObjectId();

  const product = await productModel
    .findOneAndUpdate(
      {
        _id: productId,
        isDeleted: false,
        variants: { $not: { $elemMatch: { color, size } } },
      },
      { $push: { variants: { _id: variantId, ...variantData } } },
      { returnDocument: "after", runValidators: true },
    )
    .select("variants");

  if (product) return product.variants.id(variantId);

  const productExists = await productModel.exists({
    _id: productId,
    isDeleted: false,
  });

  if (!productExists) throw new ApiError("Product not found", 404);

  throw new ApiError(
    "A variant with the same color and size already exists",
    409,
  );
};

export const updateVariant = async ({
  productId,
  variantId,
  fieldsToUpdate,
}) => {
  const $set = Object.fromEntries(
    Object.entries(fieldsToUpdate).map(([field, value]) => [
      `variants.$.${field}`,
      value,
    ]),
  );

  const product = await productModel
    .findOneAndUpdate(
      { _id: productId, isDeleted: false, "variants._id": variantId },
      { $set },
      { returnDocument: "after", runValidators: true },
    )
    .select("variants");

  if (!product) throw new ApiError("Product or variant not found", 404);

  return product.variants.id(variantId);
};
