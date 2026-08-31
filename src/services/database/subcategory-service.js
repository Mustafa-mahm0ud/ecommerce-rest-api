import subCategoryModel from "../../models/subcategory-model.js";
import Category from "../../models/category-model.js";
import * as factory from "./crud-service.js";
import ApiError from "../../utils/api-error.js";
import writeProcessedFiles from "../storage/local-storage/write-processed-files.js";

export const getById = factory.getById(subCategoryModel);
export const getDoc = factory.getDoc(subCategoryModel);
export const update = factory.update(subCategoryModel);
export const del = factory.del(subCategoryModel);

const assertCategoryExists = async (categoryId) => {
  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists)
    throw new ApiError(`No category found with id: ${categoryId}`, 404);
};

export const getDocs = async (reqQuery, reqParams, populateOptions) => {
  await assertCategoryExists(reqParams.categoryId);

  return factory.getDocs(subCategoryModel, "name image slug", "category")(
    reqQuery,
    reqParams,
    populateOptions,
  );
};

export const create = async (allowedFields, categoryId, processedImage) => {
  await assertCategoryExists(categoryId);

  const subCategory = await subCategoryModel.create({
    ...allowedFields,
    category: categoryId,
  });

  if (processedImage) await writeProcessedFiles([processedImage]);

  return subCategory;
};
