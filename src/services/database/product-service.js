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
  subCategories,
  oldProduct = null,
) => {
  if (category) {
    const isCategoryExist = await Category.exists({ _id: category });
    if (!isCategoryExist) {
      throw new ApiError(`There is no category for this id: ${category}`, 400);
    }
  }

  if (subCategories?.length > 0) {
    const dbSubCategories = await SubCategory.find({
      _id: { $in: subCategories },
    }).select("category");

    if (dbSubCategories.length !== subCategories.length) {
      throw new ApiError(
        "Some subCategories IDs don't exist in the database",
        404,
      );
    }

    const targetCategory = category || oldProduct?.category;

    if (!targetCategory) {
      throw new ApiError("Product must belong to a parent category", 400);
    }

    const isCategoryMatch = dbSubCategories.every(
      (subCat) => subCat.category.toString() === targetCategory.toString(),
    );

    if (!isCategoryMatch) {
      throw new ApiError(
        `Some SubCategories don't belong to this category: ${targetCategory}`,
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

  return factory.create(productModel)(
    fieldsToCreate,
    processedImage,
    processedImages,
  );
};

export const update = async (id, fieldsToUpdate, processedImage) => {
  let oldProduct = null;

  const { category, subCategories, imageCover, price, discountPercentage } =
    fieldsToUpdate;

  const needsOldData =
    category !== undefined ||
    subCategories !== undefined ||
    imageCover !== undefined ||
    price !== undefined ||
    discountPercentage !== undefined;

  if (needsOldData) {
    oldProduct = await factory.getById(productModel)(
      id,
      "category imageCover price discountPercentage",
    );

    if (!oldProduct)
      throw new ApiError(`No document found with id: ${id}`, 404);

    await validateProductData(category, subCategories, oldProduct);

    if (price !== undefined || discountPercentage !== undefined) {
      const productPrice = price !== undefined ? price : oldProduct.price;
      const productDiscountPercentage =
        discountPercentage ?? oldProduct.discountPercentage;

      const newPriceAfterDiscount = calculatePriceAfterDiscount(
        productPrice,
        productDiscountPercentage,
      );

      if (newPriceAfterDiscount === undefined) {
        delete fieldsToUpdate.priceAfterDiscount;
        delete fieldsToUpdate.discountPercentage;
      } else {
        fieldsToUpdate.priceAfterDiscount = newPriceAfterDiscount;
      }
    }
  }

  const hasUnset =
    discountPercentage !== undefined && parseInt(discountPercentage, 10) === 0;

  const updateQuery = hasUnset
    ? {
        $set: fieldsToUpdate,
        $unset: { discountPercentage: "", priceAfterDiscount: "" },
      }
    : { $set: fieldsToUpdate };

  const doc = await productModel.findOneAndUpdate({ _id: id }, updateQuery, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!doc) throw new ApiError(`No document found with id: ${id}`, 404);

  if (processedImage) await writeProcessedFiles([processedImage]);

  return doc;
};
