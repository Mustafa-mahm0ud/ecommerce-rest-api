import * as factory from "./crud-controller.js";
import * as categoryService from "../services/database/category-service.js";

const ALLOWED_CATEGORY_FIELDS = ["name", "image"];

/**
 *@desc        Get Categories
 *@route       GET /api/v1/categories
 * @access      Public
 */
export const getAllCategories = factory.getDocs(categoryService);

/**
 *@desc        Get Category
 *@route       GET /api/v1/categories/:id
 *@access      Public
 */
export const getCategory = factory.getDoc(categoryService);

/**
 *@desc        Create Category
 *@route       POST /api/v1/categories
 *@access      Private
 */
export const createCategory = factory.create(
  ALLOWED_CATEGORY_FIELDS,
  categoryService,
);

/**
 *@desc        Update Category
 *@route       PATCH /api/v1/categories/:id
 *@access      Private
 */
export const updateCategory = factory.update(
  ALLOWED_CATEGORY_FIELDS,
  categoryService,
  "image",
  "categories",
);

/**
 *@desc        Delete Category
 *@route       DELETE /api/v1/categories/:id
 *@access      Private
 */
export const deleteCategory = factory.del(
  categoryService,
  ["image"],
  "categories",
);
