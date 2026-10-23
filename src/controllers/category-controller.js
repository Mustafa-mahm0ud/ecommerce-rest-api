import * as factory from "./crud-controller.js";
import * as categoryService from "../services/database/category-service.js";
import ALLOWED_CATEGORY_FIELDS from "../utils/constants/category-fields.js";

/**
 *@desc        Get Categories
 *@route       GET /api/v1/categories
 * @access      Public
 */
export const getAllCategories = factory.getDocs({ service: categoryService });

/**
 *@desc        Get Category
 *@route       GET /api/v1/categories/:id
 *@access      Public
 */
export const getCategory = factory.getDoc({ service: categoryService });

/**
 *@desc        Create Category
 *@route       POST /api/v1/categories
 *@access      Private
 */
export const createCategory = factory.create({
  service: categoryService,
  fieldsToCreate: ALLOWED_CATEGORY_FIELDS,
});

/**
 *@desc        Update Category
 *@route       PATCH /api/v1/categories/:id
 *@access      Private
 */
export const updateCategory = factory.update({
  service: categoryService,
  fieldsToUpdate: ALLOWED_CATEGORY_FIELDS,
  imageField: "image",
  folderName: "categories",
});

/**
 *@desc        Delete Category
 *@route       DELETE /api/v1/categories/:id
 *@access      Private
 */
export const deleteCategory = factory.del({
  service: categoryService,
  imageFields: ["image"],
  folderName: "categories",
});
