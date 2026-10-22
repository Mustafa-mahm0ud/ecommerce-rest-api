import mongoose from "mongoose";

import cartModel from "../../models/cart-model.js";
import productModel from "../../models/product-model.js";
import ApiError from "../../utils/api-error.js";

export const getCart = async ({ userId }) => {
  const cart = await cartModel.findOne({ user: userId }).populate({
    path: "items.product",
    select:
      "title imageCover price priceAfterDiscount discountPercentage variants isDeleted",
  });

  if (!cart || !cart.items.length)
    return {
      _id: cart?._id ?? null,
      user: userId,
      items: [],
      unavailableItems: [],
      itemsCount: 0,
      total: 0,
    };

  const items = [];
  const unavailableItems = [];

  let total = 0;

  cart.items.forEach((item) => {
    const { product } = item;
    const variant = product.variants.id(item.variant);

    let reason = null;

    if (product.isDeleted) reason = "PRODUCT-UNAVAILABLE";
    else if (!variant?.isAvailable) reason = "VARIANT-UNAVAILABLE";
    else if (variant.quantity <= 0) reason = "OUT-OF-STOCK";
    else if (variant.quantity < item.quantity) reason = "INSUFFICIENT-STOCK";

    const unitPrice = product.priceAfterDiscount ?? product.price;
    const lineTotal = unitPrice * item.quantity;

    const line = {
      _id: item._id,
      product: {
        _id: product._id,
        title: product.title,
        imageCover: product.imageCover,
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount ?? null,
        discountPercentage: product.discountPercentage ?? null,
      },
      variant: variant
        ? { _id: variant._id, color: variant.color, size: variant.size }
        : null,
      quantity: item.quantity,
    };

    if (reason)
      unavailableItems.push({
        ...line,
        reason,
        ...(reason === "INSUFFICIENT-STOCK" && {
          availableQuantity: variant.quantity,
        }),
      });
    else {
      items.push(line);
      total += lineTotal;
    }
  });

  return {
    _id: cart._id,
    user: cart.user,
    items,
    unavailableItems,
    itemsCount: items.length,
    total,
  };
};

const getValidVariant = async ({ productId, variantId, quantity }) => {
  const product = await productModel
    .findOne({ _id: productId, isDeleted: false })
    .select(
      "title imageCover price priceAfterDiscount discountPercentage variants",
    );

  if (!product) throw new ApiError("Product not found", 404);

  const variant = product.variants.id(variantId);

  if (!variant) throw new ApiError("Variant not found", 404);
  if (!variant.isAvailable)
    throw new ApiError("This option is not available", 400);
  if (!variant.quantity) throw new ApiError("Product is out of stock", 400);
  if (quantity > variant.quantity)
    throw new ApiError(`Only ${variant.quantity} available in stock`, 400);

  return { product, variant };
};

export const addItem = async ({ userId, productId, variantId }) => {
  const { product, variant } = await getValidVariant({
    productId,
    variantId,
  });

  const itemFilter = { product: productId, variant: variantId };

  try {
    const itemId = new mongoose.Types.ObjectId();

    const cart = await cartModel.findOneAndUpdate(
      {
        user: userId,
        items: { $not: { $elemMatch: itemFilter } },
      },
      { $push: { items: { _id: itemId, ...itemFilter, quantity: 1 } } },
      { upsert: true, new: true },
    );

    const item = cart.items.id(itemId);

    return {
      _id: item._id,
      product: {
        _id: product._id,
        title: product.title,
        imageCover: product.imageCover,
        price: product.price,
        priceAfterDiscount: product.priceAfterDiscount ?? null,
        discountPercentage: product.discountPercentage ?? null,
      },
      variant: { _id: variant._id, color: variant.color, size: variant.size },
      quantity: item.quantity,
    };
  } catch (err) {
    if (err.code === 11000) throw new ApiError("Product already in cart", 409);
    throw err;
  }
};

export const updateQuantity = async ({
  userId,
  productId,
  variantId,
  quantity,
}) => {
  const { variant } = await getValidVariant({ productId, variantId });

  const itemFilter = { product: productId, variant: variantId };

  const result = await cartModel.updateOne(
    {
      user: userId,
      items: {
        $elemMatch: {
          ...itemFilter,
          quantity: { $gte: 1 - quantity, $lte: variant.quantity - quantity },
        },
      },
    },
    { $inc: { "items.$.quantity": quantity } },
  );

  if (!result.matchedCount) {
    const cart = await cartModel
      .findOne(
        { user: userId, items: { $elemMatch: itemFilter } },
        { "items.$": 1 },
      )
      .lean();

    console.log(cart);

    if (!cart) throw new ApiError("Item not in cart", 404);

    const newQuantity = cart.items[0].quantity + quantity;

    if (newQuantity < 1)
      throw new ApiError("Quantity can't be less than 1", 400);

    throw new ApiError(
      `Only ${variant.quantity} available in stock. your have ${cart.items[0].quantity} in cart`,
      400,
    );
  }
};

export const removeItem = async ({ userId, itemId }) => {
  const result = await cartModel.updateOne(
    { user: userId, "items._id": itemId },
    { $pull: { items: { _id: itemId } } },
  );

  if (!result.matchedCount) throw new ApiError("Item not in cart", 404);
};
