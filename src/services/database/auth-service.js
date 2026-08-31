import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userModel from "../../models/user-model.js";
import ApiError from "../../utils/api-error.js";
import { generateAccessToken } from "../../utils/generate-token.js";
import resolveResetCode from "../../utils/resolve-reset-code .js";
import hashValue from "../../helpers/hash-value.js";
import sendEmail from "../../utils/send-email.js";
import issueTokens from "./token-service.js";
import clearPasswordResetFields from "../../helpers/clear-password-reset-fields.js";

export const registerUser = async (firstName, lastName, email, password) => {
  // There's no need to check that the email exists. We have a handle duplicate key in error-middleware.
  const user = await userModel.create({ firstName, lastName, email, password });

  const { accessToken, refreshToken } = await issueTokens(user);

  return { user, accessToken, refreshToken };
};

export const login = async (email, password) => {
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Incorrect email or password", 401);

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword)
    throw new ApiError("Incorrect email or password", 401);

  if (!user.active)
    throw new ApiError("This account has been deactivated", 401);

  if (user.passwordResetCode) {
    clearPasswordResetFields(user);
    await user.save();
  }
  const { accessToken, refreshToken } = await issueTokens(user);

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new ApiError("Refresh token is missing", 401);

  // The JWT errors was handled in a error-middleware
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

  const refreshTokenHash = hashValue(refreshToken);

  const user = await userModel.exists({
    _id: decoded.userId,
    refreshTokenHash,
  });

  if (!user)
    throw new ApiError("Invalid refresh token. Please login again", 401);

  const accessToken = generateAccessToken({ userId: decoded.userId });

  return accessToken;
};

export const logout = async (refreshToken) => {
  if (!refreshToken) return;

  const refreshTokenHash = hashValue(refreshToken);

  await userModel.findOneAndUpdate(
    { refreshTokenHash },
    { refreshTokenHash: undefined, loggedOutAt: Date.now() },
  );
};

export const forgotPassword = async (email) => {
  const user = await userModel
    .findOne({ email })
    .select(
      "firstName passwordResetCode passwordResetExpires passwordResetVerified",
    );

  if (!user)
    throw new ApiError(
      "If an account exists for this email, a reset code has been sent",
      200,
    );

  const { resetCode, hashedResetCode } = resolveResetCode();

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset Code (valid for 10 minutes)",
      message: `Hi ${user.firstName},\n\nYour password reset code is: ${resetCode}\n\nThis code expires in 10 minutes. If you didn't request this, please ignore this email.`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    throw new ApiError(
      "An error occurred while sending the email. Please try again later",
      500,
    );
  }
};

export const verifyResetCode = async (email, resetCode) => {
  const { hashedResetCode } = resolveResetCode(resetCode);

  const user = await userModel.findOne({
    email,
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError("Invalid or expired reset code", 400);

  user.passwordResetVerified = true;
  await user.save();
};

export const resetPassword = async (email, newPassword) => {
  const user = await userModel.findOne({ email });

  if (!user?.passwordResetVerified)
    throw new ApiError("Reset code not verified", 400);

  user.password = newPassword;
  clearPasswordResetFields(user);
  await user.save();

  const { accessToken, refreshToken } = await issueTokens(user);

  return { accessToken, refreshToken };
};
