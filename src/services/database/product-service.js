import productModel from "../../models/product-model.js";
import categoryModel from "../../models/category-model.js";
import subcategoryModel from "../../models/subcategory-model.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";
import * as factory from "./crud-service.js";
import ApiFeatures from "../../utils/api-features.js";
import ApiError from "../../utils/api-error.js";

const crudConfig = { Model: productModel, modelName: "Product" };

export const getById = factory.getById(crudConfig);
export const hardDelete = factory.del(crudConfig);
export const addImage = factory.addImage(crudConfig);
export const deleteImage = factory.deleteImage(crudConfig);

export const validateProductRelations = async ({
  category,
  subCategoriesIds,
  currentProduct,
}) => {
  if (category) {
    const categoryExist = await categoryModel.exists({ _id: category });
    if (!categoryExist) throw new ApiError("Category not found", 404);
  }

  const targetCategory = category || currentProduct?.category;
  const categoryChanged =
    category && String(category) !== String(currentProduct?.category);

  const idsToCheck =
    subCategoriesIds ??
    (categoryChanged ? currentProduct?.subCategories : undefined);

  if (!idsToCheck?.length) return;

  if (!targetCategory) {
    throw new ApiError("Product must belong to a parent category", 400);
  }

  const uniqueIds = [...new Set(idsToCheck.map(String))];

  const count = await subcategoryModel.countDocuments({
    _id: { $in: uniqueIds },
    category: targetCategory,
  });

  if (count !== uniqueIds.length) {
    throw new ApiError(
      "Some subCategories don't exist or don't belong to product category",
      400,
    );
  }
};

export const getDocs = async ({ sanitizedQuery, includeDeleted = false }) => {
  const filter = includeDeleted ? {} : { isDeleted: false };

  const apiFeatures = new ApiFeatures(productModel.find(filter), sanitizedQuery)
    .filtering()
    .search()
    .sort()
    .limitFields(
      "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
    )
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
  productId,
  includeDeleted = false,
  populateOptions,
}) => {
  const filter = { _id: productId };
  if (!includeDeleted) filter.isDeleted = false;

  const query = productModel.findOne(filter);

  if (populateOptions) query.populate(populateOptions);

  const product = await query;

  if (!product) throw new ApiError(`Product not found`, 404);

  return product;
};

export const create = async ({
  fieldsToCreate,
  processedImage,
  processedImages,
}) => {
  const { category, subCategories } = fieldsToCreate;

  await validateProductRelations({ category, subCategoriesIds: subCategories });

  return factory.create({ Model: productModel })({
    fieldsToCreate,
    processedImage,
    processedImages,
  });
};

export const update = async ({ productId, fieldsToUpdate, processedImage }) => {
  const product = await productModel.findOne({
    _id: productId,
    isDeleted: false,
  });

  if (!product) throw new ApiError("Product not found", 404);

  const { category, subCategories } = fieldsToUpdate;

  await validateProductRelations({
    category,
    subCategoriesIds: subCategories,
    currentProduct: product,
  });

  product.set(fieldsToUpdate);

  if (processedImage) await writeProcessedFiles([processedImage]);

  await product.save();

  return product;
};

export const del = async ({ productId }) => {
  const result = await productModel.updateOne(
    { _id: productId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
  );
  if (!result.matchedCount) throw new ApiError("Product not found", 404);
};
