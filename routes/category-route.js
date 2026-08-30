import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as multerUploadMiddleware from "../middlewares/multer-upload-middleware.js";
import * as localUploadMiddleware from "../middlewares/local-upload-middleware.js";
import * as categoryValidator from "../utils/validators/category-validator.js";
import * as categoryController from "../controllers/category-controller.js";
import { nestedSubCategoryRouter } from "./subcategory-route.js";

const uploadCoverImage = multerUploadMiddleware.uploadSingleImage("image");

const resizeCoverImage = localUploadMiddleware.uploadSingleImageToLocalStorage(
  "image",
  "categories",
);

const router = express.Router();

router.use("/:categoryId/subCategories", nestedSubCategoryRouter);

// Public
router.get("/", categoryController.getAllCategories);

router.get(
  "/:id",
  categoryValidator.getCategoryValidator,
  categoryController.getCategory,
);

// Private (Admin)
router.use(authMiddleware.protect);
router.use(authMiddleware.allowedTo("admin"));

router.post(
  "/",
  uploadCoverImage,
  categoryValidator.createCategoryValidator,
  resizeCoverImage,
  categoryController.createCategory,
);

router
  .route("/:id")
  .patch(
    uploadCoverImage,
    categoryValidator.updateCategoryValidator,
    resizeCoverImage,
    categoryController.updateCategory,
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory,
  );

export default router;
