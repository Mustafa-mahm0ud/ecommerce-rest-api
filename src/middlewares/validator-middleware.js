import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().reduce((acc, err) => {
      if (err.path && !acc[err.path]) {
        acc[err.path] = err.msg;
      } else if (!err.path) {
        acc.general = err.msg;
      }

      return acc;
    }, {});
    return next(new ApiError(errorMessages, 400));
  }
  next();
};

export default validatorMiddleware;
