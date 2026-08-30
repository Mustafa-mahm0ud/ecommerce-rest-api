import express from "express";

import * as authMiddleware from "../middlewares/auth-middleware.js";
import * as reviewController from "../controllers/review-controller.js";
import * as reviewValidator from "../utils/validators/review-validator.js";

/**
 *@desc        It is only used with nested route
 *@route       /api/v1/products/:productId/reviews
 */
export const nestedReviewRouter = express.Router({ mergeParams: true });

nestedReviewRouter.get(
  "/",
  reviewValidator.getReviewsValidator,
  reviewController.getReviews,
);

nestedReviewRouter.post(
  "/",
  authMiddleware.protect,
  reviewValidator.createReviewValidator,
  reviewController.createReview,
);

/**
 *@desc       Used without nested Route
 *@route      /api/v1/reviews
 */
export const standaloneReviewRouter = express.Router();

standaloneReviewRouter.get(
  "/:id",
  reviewValidator.getReviewValidator,
  reviewController.getReview,
);

standaloneReviewRouter.use(authMiddleware.protect);
standaloneReviewRouter
  .route("/:id")
  .patch(reviewValidator.updateReviewValidator, reviewController.updateReview)
  .delete(reviewValidator.deleteReviewValidator, reviewController.deleteReview);
