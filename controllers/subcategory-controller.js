import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import * as subCategoryService from "../services/database/subcategory-service.js";
import * as factory from "./crud-controller.js";

const ALLOWED_SUBCATEGORY_FIELDS = ["name", "image"];

const ALLOWED_SUBCATEGORY_CREATE_FIELDS = [
  ...ALLOWED_SUBCATEGORY_FIELDS,
  "category",
];

const populateOptions = { path: "category", select: "name slug" };

/**
 *@desc        Get SubCategories
 *@route       GET /api/v1/categories/:categoryId/subcategories
 *@access      Public
 */
export const getSubCategories = factory.getDocs(subCategoryService);

/**
 *@desc        Get SubCategories
 *@route       GET /api/v1/subcategories/:id
 *@access      Public
 */
export const getSubCategory = factory.getDoc(
  subCategoryService,
  populateOptions,
);

/**
 *@desc        Create SubCategories
 *@route       POST /api/v1/categories/:categoryId/subcategories
 *@access      Private
 */
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const verifiedFields = pickAllowedFields(
    ALLOWED_SUBCATEGORY_CREATE_FIELDS,
    req.body,
  );

  const doc = await subCategoryService.create(
    verifiedFields,
    req.params.categoryId,
    req.processedImage,
  );

  res.status(201).json({ status: "Success", data: doc });
});

/**
 *@desc        Update SubCategories
 *@route       PATCH /api/v1/subcategories/:id
 * @access      Private
 */
export const updateSubCategory = factory.update(
  ALLOWED_SUBCATEGORY_FIELDS,
  subCategoryService,
  "image",
  "subcategories",
);

/**
 *@desc        Delete SubCategories
 *@route       DELETE /api/v1/subcategories/:id
 *@access      Private
 */
export const deleteSubCategory = factory.del(
  subCategoryService,
  ["image"],
  "subcategories",
);
