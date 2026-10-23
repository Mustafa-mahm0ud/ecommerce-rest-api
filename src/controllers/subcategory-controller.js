import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import * as subCategoryService from "../services/database/subcategory-service.js";
import * as factory from "./crud-controller.js";
import {
  ALLOWED_SUBCATEGORY_UPDATE_FIELDS,
  ALLOWED_SUBCATEGORY_CREATE_FIELDS,
} from "../utils/constants/subcategory-fields.js";

const populateOptions = { path: "category", select: "name slug" };

/**
 *@desc        Get SubCategories
 *@route       GET /api/v1/categories/:categoryId/subcategories
 *@access      Public
 */
export const getSubCategories = factory.getDocs({
  service: subCategoryService,
});

/**
 *@desc        Get SubCategories
 *@route       GET /api/v1/subcategories/:id
 *@access      Public
 */
export const getSubCategory = factory.getDoc({
  service: subCategoryService,
  populateOptions,
});

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

  const doc = await subCategoryService.create({
    allowedFields: verifiedFields,
    categoryId: req.params.categoryId,
    processedImage: req.processedImage,
  });

  res.status(201).json({ data: doc });
});

/**
 *@desc        Update SubCategories
 *@route       PATCH /api/v1/subcategories/:id
 * @access      Private
 */
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const verifiedFields = pickAllowedFields(
    ALLOWED_SUBCATEGORY_UPDATE_FIELDS,
    req.body,
  );

  const doc = await subCategoryService.update({
    allowedFields: verifiedFields,
    subCategoryId: req.params.id,
    categoryId: req.body.category,
    processedImage: req.processedImage,
  });

  res.status(200).json({ data: doc });
});

/**
 *@desc        Delete SubCategories
 *@route       DELETE /api/v1/subcategories/:id
 *@access      Private
 */
export const deleteSubCategory = factory.del({
  service: subCategoryService,
  imageFields: ["image"],
  folderName: "subcategories",
});
