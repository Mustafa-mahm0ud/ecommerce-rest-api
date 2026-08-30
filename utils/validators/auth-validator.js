import { body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const emailValidator = () =>
  body("email")
    .notEmpty()
    .withMessage("You must enter your email")
    .isEmail()
    .withMessage("Invalid email format");

const passwordValidator = () =>
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters");

export const registerValidator = [
  emailValidator(),
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("You must enter your first name")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("You must enter your last name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50"),

  passwordValidator(),

  validatorMiddleware,
];

export const loginValidator = [
  emailValidator(),

  passwordValidator(),

  validatorMiddleware,
];

export const forgotPasswordValidator = [emailValidator(), validatorMiddleware];

export const verifyResetCodeValidator = [
  emailValidator(),

  body("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be 6 digits"),

  validatorMiddleware,
];

export const resetPasswordValidator = [
  emailValidator(),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters long"),

  body("newPasswordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword)
        throw new Error("Password confirmation does not match new password");
      return true;
    }),

  validatorMiddleware,
];
