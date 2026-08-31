import brandModel from "../../models/brand-model.js";
import * as factory from "./crud-service.js";

export const getById = factory.getById(brandModel);
export const getDocs = factory.getDocs(brandModel, "name image slug");
export const getDoc = factory.getDoc(brandModel);
export const create = factory.create(brandModel);
export const update = factory.update(brandModel);
export const del = factory.del(brandModel);
