import wishlistModel from "../../models/wishlist-model.js";
import productModel from "../../models/product-model.js";
import ApiError from "../../utils/api-error.js";

export const getDoc = async (userId) => {
  const wishlist = await wishlistModel.findOne({ user: userId }).populate({
    path: "products",
    select:
      "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
  });

  if (!wishlist)
    throw new ApiError(`No wishlist found for this user ${userId}`, 404);

  return wishlist;
};

export const addProduct = async (userId, productId) => {
  const productExists = await productModel.exists({ _id: productId });

  if (!productExists)
    throw new ApiError(`No product found with id ${productId}`, 404);

  const wishlist = await wishlistModel.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } },
    { returnDocument: "after", runValidators: true },
  );

  if (!wishlist)
    throw new ApiError(`No wishlist found for this user ${userId}`, 404);

  return wishlist;
};

export const removeProduct = async (userId, productId) => {
  const wishlist = await wishlistModel.findOneAndUpdate(
    {
      user: userId,
      products: productId,
    },
    { $pull: { products: productId } },
    { returnDocument: "after" },
  );

  if (!wishlist)
    throw new ApiError(
      `Wishlist not found for this user, or product ${productId} is not in it`,
      404,
    );

  return wishlist;
};
