import asyncHandler from "express-async-handler";

import * as authService from "../services/database/auth-service.js";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 90 * 24 * 60 * 60 * 1000,
};

const sendAuthResponse = (
  res,
  statusCode,
  { user, accessToken, refreshToken },
) => {
  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

  res.status(statusCode).json({
    status: "success",
    data: user,
    accessToken,
  });
};

/**
 *@desc        Sign Up (Register new user)
 *@route       POST /api/v1/auth/signup
 *@access      Public
 */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.registerUser(
    firstName,
    lastName,
    email,
    password,
  );

  sendAuthResponse(res, 201, { user, accessToken, refreshToken });
});

/**
 *@desc        Login
 *@route       POST /api/v1/auth/login
 *@access      Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authService.login(
    email,
    password,
  );

  sendAuthResponse(res, 200, { user, accessToken, refreshToken });
});

/**
 *@desc        Get new Access Token using Refresh Token
 *@route       POST /api/v1/auth/refresh-token
 *@access      Public ( just need invalid refresh token cookie )
 */
export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  const accessToken = await authService.refreshAccessToken(refreshToken);

  res.status(200).json({ status: "success", accessToken });
});

/**
 *@desc        Logout - cancel Refresh Token
 *@route       POST /api/v1/auth/logout
 *@access      Public
 */
export const logout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);
  res.status(204).send();
});

/**
 *@desc        Forgot Password - send reset code via email
 *@route       POST /api/v1/auth/forgot-password
 *@access      Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.status(200).json({
    status: "success",
    message: "If an account exists for this email, a reset code has been sent",
  });
});

/**
 *@desc        Verify Password Reset Code
 *@route       POST /api/v1/auth/verify-reset-code
 *@access      Public
 */
export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, resetCode } = req.body;

  await authService.verifyResetCode(email, resetCode);

  res.status(200).json({ status: "success" });
});

/**
 *@desc        Reset Password - after code is verified
 *@route       PATCH /api/v1/auth/reset-password
 *@access      Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  const { accessToken, refreshToken } = await authService.resetPassword(
    email,
    newPassword,
  );

  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  res.status(200).json({ status: "success", accessToken });
});
