// routes/cart-route.js
import express from "express";
import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as cartController from "../controllers/cart-controller.js";
import * as cartValidator from "../utils/validators/cart-validator.js";

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/", cartController.getCart);

router
  .route("/items/:productId/:variantId")
  .post(cartValidator.addItemValidator, cartController.addItem)
  .patch(cartValidator.updateQuantityValidator, cartController.updateQuantity);

router.delete(
  "/items/:itemId",
  cartValidator.removeItemValidator,
  cartController.removeItem,
);

export default router;
