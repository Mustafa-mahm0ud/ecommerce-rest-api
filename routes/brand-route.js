import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as multerUploadMiddleware from "../middlewares/multer-upload-middleware.js";
import * as localUploadMiddleware from "../middlewares/local-upload-middleware.js";
import * as brandValidator from "../utils/validators/brand-validator.js";
import * as brandController from "../controllers/brand-controller.js";

const uploadCoverImage = multerUploadMiddleware.uploadSingleImage("image");

const resizeCoverImage = localUploadMiddleware.uploadSingleImageToLocalStorage(
  "image",
  "brands",
);

const router = express.Router();

// Public
router.get("/", brandController.getBrands);
router.get("/:id", brandValidator.getBrandValidator, brandController.getBrand);

// Private (Admin)
router.use(authMiddleware.protect);
router.use(authMiddleware.allowedTo("admin"));

router.post(
  "/",
  uploadCoverImage,
  brandValidator.createBrandValidator,
  resizeCoverImage,
  brandController.createBrand,
);

router
  .route("/:id")
  .patch(
    uploadCoverImage,
    brandValidator.updateBrandValidator,
    resizeCoverImage,
    brandController.updateBrand,
  )
  .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);

export default router;
