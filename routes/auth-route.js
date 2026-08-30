import express from "express";

import * as authController from "../controllers/auth-controller.js";
import * as authValidator from "../utils/validators/auth-validator.js";

const router = express.Router();

router.post(
  "/signup",
  authValidator.registerValidator,
  authController.registerUser,
);
router.post("/login", authValidator.loginValidator, authController.login);
router.post("/refresh-token", authController.refreshAccessToken);
router.post("/logout", authController.logout);

router.post(
  "/forgot-password",
  authValidator.forgotPasswordValidator,
  authController.forgotPassword,
);
router.post(
  "/verify-reset-code",
  authValidator.verifyResetCodeValidator,
  authController.verifyResetCode,
);
router.patch(
  "/reset-password",
  authValidator.resetPasswordValidator,
  authController.resetPassword,
);

export default router;
