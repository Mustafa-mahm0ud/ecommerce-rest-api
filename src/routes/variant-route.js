import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as variantController from "../controllers/variant-controller.js";
import * as variantValidator from "../utils/validators/variant-validator.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware.protect, authMiddleware.allowedTo("admin"));

router.post(
  "/",
  variantValidator.addVariantValidator,
  variantController.addVariant,
);

router.patch(
  "/:variantId",
  variantValidator.updateVariantValidator,
  variantController.updateVariant,
);

export default router;
