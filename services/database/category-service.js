import categoryModel from "../../models/category-model.js";
import * as factory from "./crud-service.js";

export const getById = factory.getById(categoryModel);
export const getDocs = factory.getDocs(categoryModel, "name image slug");
export const getDoc = factory.getDoc(categoryModel);
export const create = factory.create(categoryModel);
export const update = factory.update(categoryModel);
export const del = factory.del(categoryModel);
