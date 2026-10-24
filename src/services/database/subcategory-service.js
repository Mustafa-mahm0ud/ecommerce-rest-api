import subCategoryModel from "../../models/subcategory-model.js";
import Category from "../../models/category-model.js";
import * as factory from "./crud-service.js";
import ApiError from "../../utils/api-error.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";

export const getById = factory.getById({
  Model: subCategoryModel,
  modelName: "SubCategory",
});
export const getDoc = factory.getDoc({
  Model: subCategoryModel,
  modelName: "SubCategory",
});
export const del = factory.del({
  Model: subCategoryModel,
  modelName: "SubCategory",
});

const assertCategoryExists = async (categoryId) => {
  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists) throw new ApiError(`Category not found`, 404);
};

export const getDocs = async ({
  sanitizedQuery,
  reqParams,
  populateOptions,
}) => {
  await assertCategoryExists(reqParams.categoryId);

  return factory.getDocs({
    Model: subCategoryModel,
    defaultFields: "name image slug",
    nestedFilterField: "category",
  })({ sanitizedQuery, reqParams, populateOptions });
};

export const create = async ({ allowedFields, categoryId, processedImage }) => {
  await assertCategoryExists(categoryId);

  const subCategory = await subCategoryModel.create({
    ...allowedFields,
    category: categoryId,
  });

  if (processedImage) await writeProcessedFiles([processedImage]);

  return subCategory;
};

export const update = async ({
  allowedFields,
  subCategoryId,
  categoryId,
  processedImage,
}) => {
  await assertCategoryExists(categoryId);

  return factory.update({ Model: subCategoryModel, modelName: "SubCategory" })({
    subCategoryId,
    allowedFields,
    processedImage,
  });
};
