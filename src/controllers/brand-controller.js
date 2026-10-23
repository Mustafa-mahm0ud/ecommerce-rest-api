import * as factory from "./crud-controller.js";
import * as brandService from "../services/database/brand-service.js";
import ALLOWED_BRAND_FIELDS from "../utils/constants/brand-fields.js";

/**
 *@desc        Get Brands
 *@route       GET /api/v1/brands
 *@access      Public
 */
export const getBrands = factory.getDocs({ service: brandService });

/**
 *@desc        Get Specific Brand
 * @route       GET /api/v1/brands/:id
 *@access      Public
 */
export const getBrand = factory.getDoc({ service: brandService });

/**
 *@desc        Create Brand
 *@route       POST /api/v1/brands
 *@access      Private
 */
export const createBrand = factory.create({
  service: brandService,
  fieldsToCreate: ALLOWED_BRAND_FIELDS,
});

/**
 *@desc        Update Brand
 *@route       PATCH /api/v1/brands/:id
 *@access      Private
 */
export const updateBrand = factory.update({
  service: brandService,
  fieldsToUpdate: ALLOWED_BRAND_FIELDS,
  imageField: "image",
  folderName: "brands",
});

/**
 *@desc        Delete Brand
 *@route       DELETE /api/v1/brands/:id
 *@access      Private
 */
export const deleteBrand = factory.del({
  service: brandService,
  imageFields: ["image"],
  folderName: "brands",
});
