import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import * as userService from "../services/database/user-service.js";
import ApiError from "../utils/api-error.js";

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return next(
      new ApiError("You are not logged in. Please login to get access", 401),
    );

  const token = authHeader.split(" ")[1];

  if (!token)
    return next(
      new ApiError("You are not logged in. Please login to get access", 401),
    );

  // The JWT errors was handled in a error-middleware
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await userService.getById(
    decoded.userId,
    "role active passwordChangedAt loggedOutAt",
  );

  if (!currentUser)
    return next(
      new ApiError("The user belonging to this token no longer exists", 401),
    );

  if (!currentUser.active)
    return next(new ApiError("This account has been deactivated", 401));

  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamps = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );

    if (decoded.iat < passwordChangedTimestamps)
      return next(
        new ApiError("Password was recently changed. Please login again", 401),
      );
  }

  if (currentUser.loggedOutAt) {
    const loggedOutTimestamps = parseInt(
      currentUser.loggedOutAt.getTime() / 1000,
      10,
    );

    if (decoded.iat < loggedOutTimestamps)
      return next(new ApiError("User logged out. Please login again", 401));
  }

  req.user = { _id: currentUser._id, role: currentUser.role };

  next();
});

export const allowedTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("You are not allowed to perform this action", 403),
      );

    next();
  };
