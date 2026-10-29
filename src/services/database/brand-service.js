import brandModel from "../../models/brand-model.js";
import * as factory from "./crud-service.js";

const crudConfig = { Model: brandModel, modelName: "Brand" };

export const getById = factory.getById(crudConfig);
export const getDocs = factory.getDocs(crudConfig);
export const getDoc = factory.getDoc(crudConfig);
export const create = factory.create(crudConfig);
export const update = factory.update(crudConfig);
export const del = factory.del(crudConfig);
