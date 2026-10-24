import categoryModel from "../../models/category-model.js";
import * as factory from "./crud-service.js";

export const getById = factory.getById({
  Model: categoryModel,
  modelName: "Category",
});
export const getDocs = factory.getDocs({
  Model: categoryModel,
  defaultFields: "name image slug",
});
export const getDoc = factory.getDoc({
  Model: categoryModel,
  modelName: "Category",
});
export const create = factory.create({
  Model: categoryModel,
  modelName: "Category",
});
export const update = factory.update({
  Model: categoryModel,
  modelName: "Category",
});
export const del = factory.del({ Model: categoryModel, modelName: "Category" });
