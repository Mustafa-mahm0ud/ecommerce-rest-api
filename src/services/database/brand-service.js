import brandModel from "../../models/brand-model.js";
import * as factory from "./crud-service.js";

export const getById = factory.getById({
  Model: brandModel,
  modelName: "Brand",
});
export const getDocs = factory.getDocs({
  Model: brandModel,
  defaultFields: "name image slug",
});
export const getDoc = factory.getDoc({
  Model: brandModel,
  modelName: "Brand",
});
export const create = factory.create({
  Model: brandModel,
  modelName: "Brand",
});
export const update = factory.update({
  Model: brandModel,
  modelName: "Brand",
});
export const del = factory.del({ Model: brandModel, modelName: "Brand" });
