import mongoose from "mongoose";

import productModel from "../../models/product-model.js";
import Category from "../../models/category-model.js";
import SubCategory from "../../models/subcategory-model.js";
import calculatePriceAfterDiscount from "../../helpers/product-calculations.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";
import ApiError from "../../utils/api-error.js";
import * as factory from "./crud-service.js";

export const getDocs = factory.getDocs(
  productModel,
  "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
);
export const getById = factory.getById(productModel);
export const getDoc = factory.getDoc(productModel);
export const del = factory.del(productModel);
export const addImage = factory.addImage(productModel);
export const deleteImage = factory.deleteImage(productModel);

export const validateProductData = async (
  category,
  subCategoriesIds,
  currentProduct,
) => {
  if (category) {
    const isCategoryExist = await Category.exists({ _id: category });
    if (!isCategoryExist) {
      throw new ApiError(`No category found with id: ${category}`, 400);
    }
  }

  if (subCategoriesIds?.length > 0) {
    const targetCategory = category || currentProduct?.category;

    if (!targetCategory) {
      throw new ApiError("Product must belong to a parent category", 400);
    }

    const [{ count = 0 } = {}] = await SubCategory.aggregate([
      {
        $match: {
          _id: {
            $in: subCategoriesIds.map(
              (subCategoryId) => new mongoose.Types.ObjectId(subCategoryId),
            ),
          },
          category: new mongoose.Types.ObjectId(targetCategory),
        },
      },
      { $count: "count" },
    ]);

    if (count !== subCategoriesIds.length) {
      throw new ApiError(
        `Some subCategories don't exist or don't belong to this category: ${targetCategory}`,
        400,
      );
    }
  }
};

export const create = async (
  fieldsToCreate,
  processedImage,
  processedImages,
) => {
  const { category, subCategories, price, discountPercentage } = fieldsToCreate;
  await validateProductData(category, subCategories);

  fieldsToCreate.priceAfterDiscount = calculatePriceAfterDiscount(
    price,
    discountPercentage,
  );

  if (fieldsToCreate.priceAfterDiscount === undefined)
    delete fieldsToCreate.priceAfterDiscount;

  return factory.create(productModel)(
    fieldsToCreate,
    processedImage,
    processedImages,
  );
};

export const update = async (
  id,
  fieldsToUpdate,
  currentProduct,
  processedImage,
) => {
  const { category, subCategories, price, discountPercentage } = fieldsToUpdate;

  const updateQuery = { $set: fieldsToUpdate };

  await validateProductData(category, subCategories, currentProduct);

  if (price !== undefined || discountPercentage !== undefined) {
    if (!currentProduct) {
      console.error("Current product data is required to update pricing");

      throw new ApiError(
        "Something went wrong on our side. Please try again later",
        500,
      );
    }

    const productPrice = price || currentProduct.price;
    const productDiscountPercentage =
      discountPercentage ?? currentProduct.discountPercentage;

    const newPriceAfterDiscount = calculatePriceAfterDiscount(
      productPrice,
      productDiscountPercentage,
    );

    if (
      newPriceAfterDiscount === undefined &&
      productDiscountPercentage !== undefined
    ) {
      delete fieldsToUpdate.priceAfterDiscount;
      updateQuery.$unset = { priceAfterDiscount: "" };
    } else {
      fieldsToUpdate.priceAfterDiscount = newPriceAfterDiscount;
    }
  }

  const doc = await productModel.findOneAndUpdate({ _id: id }, updateQuery, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

  if (processedImage) await writeProcessedFiles([processedImage]);

  return doc;
};
