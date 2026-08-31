import multer from "multer";
import ApiError from "../utils/api-error.js";

const handleMulterError = (err) => {
  let message = "File upload error. Please check the uploaded file(s)";
  if (err.code === "LIMIT_UNEXPECTED_FILE")
    message = `Unexpected field: "${err.field}". Please check the field name used for uploading the file(s) or check the number of files uploaded`;
  else if (err.code === "LIMIT_FILE_SIZE")
    message = "File is too large. Maximum allowed size is 5MB";
  else if (err.code === "LIMIT_FILE_COUNT")
    message = "Too many files uploaded. Please check the number of files";

  return new ApiError(message, 400, true, err.stack);
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}. Please provide a valid value`;
  return new ApiError(message, 400, true, err.stack);
};

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = field ? err.keyValue[field] : null;
  const message = field
    ? `"${value}" already exists, please use a different ${field}`
    : "Duplicate field value entered";

  return new ApiError(message, 409, true, err.stack);
};

const handleJwtError = (err) =>
  new ApiError(
    "Invalid or expired token. Please login again",
    401,
    true,
    err.stack,
  );

const handleValidationError = (err) => {
  const errors = Object.keys(err.errors).reduce((acc, key) => {
    acc[key] = err.errors[key].message;
    return acc;
  }, {});

  return new ApiError(errors, 400, true, err.stack);
};

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    errors: err.errors,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      errors: err.errors,
    });
  }

  console.error("ERROR INTERN:", err);
  res.status(500).json({
    status: "error",
    errors: {
      general: "Something went wrong on our side. Please try again later",
    },
  });
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof multer.MulterError) error = handleMulterError(err);
  else if (err.name === "CastError") error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKeyError(err);
  else if (err.name === "ValidationError") error = handleValidationError(err);
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    error = handleJwtError(err);

  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  error.errors = error.errors || { general: error.message };

  if (process.env.NODE_ENV === "development") sendErrorForDev(error, res);
  else sendErrorForProd(error, res);
};

export default errorHandler;
