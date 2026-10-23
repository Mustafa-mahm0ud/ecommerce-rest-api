import brandModel from "../../models/brand-model.js";
import * as factory from "./crud-service.js";

export const getById = factory.getById({ Model: brandModel });
export const getDocs = factory.getDocs({
  Model: brandModel,
  defaultFields: "name image slug",
});
export const getDoc = factory.getDoc({ Model: brandModel });
export const create = factory.create({ Model: brandModel });
export const update = factory.update({ Model: brandModel });
export const del = factory.del({ Model: brandModel });
