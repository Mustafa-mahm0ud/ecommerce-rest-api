import * as factory from "./crud-controller.js";
import * as brandService from "../services/database/brand-service.js";

const ALLOWED_BRAND_FIELDS = ["name", "image"];

/**
 *@desc        Get Brands
 *@route       GET /api/v1/brands
 *@access      Public
 */
export const getBrands = factory.getDocs(brandService);

/**
 *@desc        Get Specific Brand
 * @route       GET /api/v1/brands/:id
 *@access      Public
 */
export const getBrand = factory.getDoc(brandService);

/**
 *@desc        Create Brand
 *@route       POST /api/v1/brands
 *@access      Private
 */
export const createBrand = factory.create(ALLOWED_BRAND_FIELDS, brandService);

/**
 *@desc        Update Brand
 *@route       PATCH /api/v1/brands/:id
 *@access      Private
 */
export const updateBrand = factory.update(
  ALLOWED_BRAND_FIELDS,
  brandService,
  "image",
  "brands",
);

/**
 *@desc        Delete Brand
 *@route       DELETE /api/v1/brands/:id
 *@access      Private
 */
export const deleteBrand = factory.del(brandService, ["image"], "brands");
