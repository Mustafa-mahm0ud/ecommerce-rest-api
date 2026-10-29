import categoryModel from "../../models/category-model.js";
import * as factory from "./crud-service.js";

const crudConfig = { Model: categoryModel, modelName: "Category" };

export const getById = factory.getById(crudConfig);
export const getDocs = factory.getDocs(crudConfig);
export const getDoc = factory.getDoc(crudConfig);
export const create = factory.create(crudConfig);
export const update = factory.update(crudConfig);
export const del = factory.del(crudConfig);
