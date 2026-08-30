import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as multerUploadMiddleware from "../middlewares/multer-upload-middleware.js";
import * as localUploadMiddleware from "../middlewares/local-upload-middleware.js";
import * as productController from "../controllers/product-controller.js";
import * as productValidator from "../utils/validators/product-validator.js";
import { nestedReviewRouter } from "./review-route.js";

const uploadCoverImage = multerUploadMiddleware.uploadSingleImage("imageCover");

const uploadGalleryImages = multerUploadMiddleware.uploadImages("images", 5);

const uploadMixOfImages = multerUploadMiddleware.uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const resizeCoverImage = localUploadMiddleware.uploadSingleImageToLocalStorage(
  "imageCover",
  "products",
);

const resizeGalleryImages = localUploadMiddleware.uploadImagesToLocalStorage(
  "images",
  "products",
);

const router = express.Router();

router.use("/:productId/reviews", nestedReviewRouter);

// Public
router.get("/", productController.getProducts);

router.get(
  "/:id",
  productValidator.getProductValidator,
  productController.getProduct,
);

// router.use("/:productId/reviews");

// Private (Admin)
router.use(authMiddleware.protect);
router.use(authMiddleware.allowedTo("admin"));

router.post(
  "/",
  uploadMixOfImages,
  productValidator.createProductValidator,
  resizeCoverImage,
  resizeGalleryImages,
  productController.createProduct,
);

router
  .route("/:id")
  .patch(
    uploadCoverImage,
    productValidator.updateProductValidator,
    resizeCoverImage,
    productController.updateProduct,
  )
  .delete(
    productValidator.deleteProductValidator,
    productController.deleteProduct,
  );

router.post(
  "/:id/images",
  uploadGalleryImages,
  productValidator.addProductImagesValidator,
  resizeGalleryImages,
  productController.addProductImage,
);

router.delete(
  "/:id/images/:imageName",
  productValidator.deleteProductImageValidator,
  productController.deleteProductImage,
);

export default router;
