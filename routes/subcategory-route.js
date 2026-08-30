import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as multerUploadMiddleware from "../middlewares/multer-upload-middleware.js";
import * as localUploadMiddleware from "../middlewares/local-upload-middleware.js";
import * as subCategoryValidator from "../utils/validators/subcategory-validator.js";
import * as subCategoryController from "../controllers/subcategory-controller.js";

const uploadCoverImage = multerUploadMiddleware.uploadSingleImage("image");

const resizeCoverImage = localUploadMiddleware.uploadSingleImageToLocalStorage(
  "image",
  "subCategories",
);

/**
 *@desc        It is only used with nested route
 *@route       /api/v1/categories/:categoryId/subCategories
 */
export const nestedSubCategoryRouter = express.Router({ mergeParams: true });

nestedSubCategoryRouter.get(
  "/",
  subCategoryValidator.getSubCategoriesValidator,
  subCategoryController.getSubCategories,
);

nestedSubCategoryRouter.post(
  "/",
  authMiddleware.protect,
  authMiddleware.allowedTo("admin"),
  uploadCoverImage,
  subCategoryValidator.createSubCategoryValidator,
  resizeCoverImage,
  subCategoryController.createSubCategory,
);

/**
 *@desc       Used without nested route
 *@route      /api/v1/subCategories
 */
export const standaloneSubCategoryRouter = express.Router();

standaloneSubCategoryRouter.get(
  "/:id",
  subCategoryValidator.getSubCategoryValidator,
  subCategoryController.getSubCategory,
);

standaloneSubCategoryRouter.use(authMiddleware.protect);
standaloneSubCategoryRouter.use(authMiddleware.allowedTo("admin"));

standaloneSubCategoryRouter
  .route("/:id")
  .patch(
    uploadCoverImage,
    subCategoryValidator.updateSubCategoryValidator,
    resizeCoverImage,
    subCategoryController.updateSubCategory,
  )
  .delete(
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory,
  );
