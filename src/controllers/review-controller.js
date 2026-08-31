import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import * as factory from "./crud-controller.js";
import * as reviewService from "../services/database/review-service.js";

const ALLOWED_REVIEW_FIELDS = ["title", "rating"];

const populateOptions = { path: "user", select: "name profileImage" };

/**
 *@desc        Get Reviews
 *@route       GET /api/v1/products/:productId/reviews
 *@access      Public
 */
export const getReviews = factory.getDocs(reviewService, populateOptions);

/**
 *@desc        Get Specific Review
 *@route       GET /api/v1/reviews/:id
 *@access      Public
 */
export const getReview = factory.getDoc(reviewService, populateOptions);

/**
 *@desc        Create Review
 *@route       POST /api/v1/products/:productId/reviews
 *@access      Private
 */
export const createReview = asyncHandler(async (req, res, next) => {
  const verifiedFields = pickAllowedFields(ALLOWED_REVIEW_FIELDS, req.body);

  const review = await reviewService.create(
    req.user._id,
    verifiedFields,
    req.params.productId,
  );

  res.status(201).json({ status: "Success", data: review });
});

/**
 *@desc        Update Review
 *@route       PATCH /api/v1/reviews/:id
 *@access      Private
 */
export const updateReview = asyncHandler(async (req, res, next) => {
  const verifiedFields = pickAllowedFields(ALLOWED_REVIEW_FIELDS, req.body);

  const review = await reviewService.update(
    req.user._id,
    verifiedFields,
    req.params.id,
  );

  res.status(200).json({ status: "success", data: review });
});

/**
 *@desc        Delete Review
 *@route       DELETE /api/v1/reviews/:id
 *@access      Private
 */
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { _id, role } = req.user;

  await reviewService.deleteReview(_id, role, req.params.id);

  res.status(204).send();
});
