import Product from "../../models/product-model.js";
import reviewModel from "../../models/review-model.js";
import ApiError from "../../utils/api-error.js";
import * as factory from "./crud-service.js";

export const getDoc = factory.getDoc(reviewModel);

export const getDocs = async (reqQuery, reqParams, populateOptions) => {
  const { productId } = reqParams;

  const product = await Product.exists({ _id: productId });

  if (!product)
    throw new ApiError(`No product found with id: ${productId}`, 404);

  return factory.getDocs(reviewModel, "", "product")(
    reqQuery,
    reqParams,
    populateOptions,
  );
};

export const create = async (userId, productId, verifiedFields) => {
  const product = await Product.exists({ _id: productId });
  if (!product)
    throw new ApiError(`No product found with id: ${productId}`, 404);

  return reviewModel.create({
    ...verifiedFields,
    user: userId,
    product: productId,
  });
};

export const update = async (userId, reviewId, verifiedFields) => {
  const userReview = await reviewModel.findOne({
    _id: reviewId,
    user: userId,
  });

  if (!userReview)
    throw new ApiError(
      `No review found with id '${reviewId}' for this user`,
      404,
    );

  Object.assign(userReview, verifiedFields);

  await userReview.save();

  return userReview;
};

export const deleteReview = async (userId, userRole, reviewId) => {
  const filter =
    userRole === "admin" ? { _id: reviewId } : { _id: reviewId, user: userId };

  const review = await reviewModel.findOneAndDelete(filter);
  if (!review)
    throw new ApiError(
      `No review found with id '${reviewId}' for this user`,
      404,
    );
};
