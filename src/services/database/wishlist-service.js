import wishlistModel from "../../models/wishlist-model.js";
import productModel from "../../models/product-model.js";
import ApiError from "../../utils/api-error.js";

export const getDoc = async (userId) => {
  const wishlist = await wishlistModel.findOne({ user: userId });

  if (!wishlist) return { _id: null, user: userId, products: [] };

  const originalIds = [...wishlist.products];

  await wishlist.populate({
    path: "products",
    select:
      "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
  });

  const ghostIds = [];
  wishlist.products = wishlist.products.filter((product, index) => {
    if (product === null) {
      ghostIds.push(originalIds[index]);
      return false;
    }
    return true;
  });

  // fire and forget
  if (ghostIds.length > 0) {
    wishlistModel
      .updateOne(
        { _id: wishlist._id },
        { $pull: { products: { $in: ghostIds } } },
      )
      .catch((err) =>
        console.error(
          `Failed to clean ghost products for wishlist ${wishlist._id}:`,
          err,
        ),
      );
  }

  return wishlist;
};

export const addProduct = async (userId, productId) => {
  const productExists = await productModel.exists({ _id: productId });

  if (!productExists)
    throw new ApiError(`No product found with id ${productId}`, 404);

  const wishlist = await wishlistModel.findOneAndUpdate(
    { user: userId },
    { $addToSet: { products: productId } },
    { returnDocument: "after", runValidators: true, upsert: true },
  );

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
    throw new ApiError(`Product '${productId}' not found in wishlist`, 404);

  return wishlist;
};
