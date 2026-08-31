import wishlistModel from "../../models/wishlist-model.js";
import ApiError from "../../utils/api-error.js";

const getDoc = async (userId) => {
  const wishlist = await wishlistModel.findOne({ user: userId }).populate({
    path: "products",
    select:
      "title price slug imageCover discountPercentage priceAfterDiscount avgRatings ratingsCount",
  });

  return wishlist;
};
