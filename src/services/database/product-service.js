import productModel from "../../models/product-model.js";
import categoryModel from "../../models/category-model.js";
import subcategoryModel from "../../models/subcategory-model.js";
import calculatePriceAfterDiscount from "../../helpers/product-calculations.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";
import * as factory from "./crud-service.js";
import ApiFeatures from "../../utils/api-features.js";
import ApiError from "../../utils/api-error.js";

export const getById = factory.getById(productModel);
export const hardDelete = factory.del(productModel);
export const addImage = factory.addImage(productModel);
export const deleteImage = factory.deleteImage(productModel);

export const validateProductData = async ({
  category,
  subCategoriesIds,
  currentProduct,
}) => {
  if (category) {
    const categoryExist = await categoryModel.exists({ _id: category });
    if (!categoryExist) {
      throw new ApiError(`No category found with id: ${category}`, 400);
    }
  }

  if (subCategoriesIds?.length > 0) {
    const uniqueIds = [...new Set(subCategoriesIds)];

    const targetCategory = category || currentProduct?.category;

    if (!targetCategory) {
      throw new ApiError("Product must belong to a parent category", 400);
    }

    const count = await subcategoryModel.countDocuments({
      _id: {
        $in: uniqueIds,
      },
      category: targetCategory,
    });

    if (count !== subCategoriesIds.length) {
      throw new ApiError(
        `Some subCategories don't exist or don't belong to this category: ${targetCategory}`,
        400,
      );
    }
  }
};

export const getDocs = async ({ reqQuery, includeDeleted = false, select }) => {
  const filter = includeDeleted ? {} : { isDeleted: false };

  const apiFeatures = new ApiFeatures(productModel.find(filter), reqQuery)
    .filtering()
    .search()
    .sort()
    .limitFields(select)
    .paginate();

  const { mongooseQuery, filterQuery } = apiFeatures;

  const [docs, totalDocs] = await Promise.all([
    mongooseQuery,
    productModel.countDocuments({ ...filter, ...filterQuery }),
  ]);

  const paginationResult = apiFeatures.buildPaginationResult(totalDocs);

  return { docs, paginationResult };
};

export const getDoc = async ({
  id,
  includeDeleted = false,
  populateOptions,
}) => {
  const filter = { _id: id };
  if (!includeDeleted) filter.isDeleted = false;

  const query = productModel.findOne(filter);

  if (populateOptions) query.populate(populateOptions);

  const product = await query;

  if (!product) throw new ApiError(`No document found with id: ${id}`, 404);

  return product;
};

export const create = async ({
  fieldsToCreate,
  processedImage,
  processedImages,
}) => {
  const { category, subCategories, price, discountPercentage } = fieldsToCreate;

  await validateProductData({ category, subCategories });

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

export const update = async ({
  productId,
  fieldsToUpdate,
  currentProduct,
  processedImage,
}) => {
  const { category, subCategories, price, discountPercentage } = fieldsToUpdate;

  const updateQuery = { $set: fieldsToUpdate };

  await validateProductData({ category, subCategories, currentProduct });

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

  const doc = await productModel.findOneAndUpdate(
    { _id: productId, isDeleted: false },
    updateQuery,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!doc) throw new ApiError(`Product not found`, 404);

  if (processedImage) await writeProcessedFiles([processedImage]);

  return doc;
};

export const del = async ({ id }) => {
  const product = await productModel.updateOne(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
  );
  if (!product.matchedCount) throw new ApiError("Product not found", 404);
};
