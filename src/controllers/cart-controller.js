import asyncHandler from "express-async-handler";
import * as cartService from "../services/database/cart-service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart({ userId: req.user._id });

  res.status(200).json({ data: cart });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;

  const item = await cartService.addItem({
    userId: req.user._id,
    productId,
    variantId,
  });

  res.status(200).json({ data: item });
});

export const updateQuantity = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.params;

  await cartService.updateQuantity({
    userId: req.user._id,
    productId,
    variantId,
    quantity: req.body.quantity,
  });

  res.sendStatus(204);
});

export const removeItem = asyncHandler(async (req, res) => {
  await cartService.removeItem({
    userId: req.user._id,
    itemId: req.params.itemId,
  });

  res.sendStatus(204);
});
