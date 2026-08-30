import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as multerUploadMiddleware from "../middlewares/multer-upload-middleware.js";
import * as localUploadMiddleware from "../middlewares/local-upload-middleware.js";
import * as userValidator from "../utils/validators/user-validator.js";
import * as userController from "../controllers/user-controller.js";

const uploadCoverImage =
  multerUploadMiddleware.uploadSingleImage("profileImage");

const resizeCoverImage = localUploadMiddleware.uploadSingleImageToLocalStorage(
  "profileImage",
  "users",
);

const router = express.Router();

// Protect (Users)
router.use(authMiddleware.protect);

router.get("/profile", userController.getProfile);

router.patch(
  "/profile-update",
  uploadCoverImage,
  userValidator.updateProfileValidator,
  resizeCoverImage,
  userController.updateProfile,
);

router.patch(
  "/profile/update-password",
  userValidator.updateProfilePasswordValidator,
  userController.updateProfilePassword,
);

router.patch("/profile/deactivate", userController.deactivateProfile);

// Private (Admin)
router.use(authMiddleware.allowedTo("admin"));

router
  .route("/")
  .get(userController.getUsers)
  .post(
    uploadCoverImage,
    userValidator.createUserValidator,
    resizeCoverImage,
    userController.createUser,
  );

router
  .route("/:id")
  .get(userValidator.getUserValidator, userController.getUser)
  .patch(
    uploadCoverImage,
    userValidator.updateUserValidator,
    resizeCoverImage,
    userController.updateUser,
  )
  .delete(userValidator.deleteUserValidator, userController.deleteUser);

router.patch(
  "/:id/role",
  userValidator.updateUserRoleValidator,
  userController.updateUserRole,
);

router.patch(
  "/:id/deactivate",
  userValidator.deactivateUserValidator,
  userController.deactivateUser,
);

export default router;
