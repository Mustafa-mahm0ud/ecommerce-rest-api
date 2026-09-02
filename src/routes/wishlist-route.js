import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as wishlistController from "../controllers/wishlist-controller.js";
import * as wishlistValidator from "../utils/validators/wishlist-validator.js";

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route("/")
  .get(wishlistController.getWishlist)
  .post(wishlistValidator.addProductValidator, wishlistController.addProduct)
  .delete(
    wishlistValidator.removeProductValidator,
    wishlistController.removeProduct,
  );

export default router;
