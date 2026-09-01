import { param, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validator-middleware.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

const firstNameValidator = (isRequired = false) =>
  requiredOrOptional("firstName", isRequired, "You must enter your first name")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50");

const lastNameValidator = (isRequired) =>
  requiredOrOptional("lastName", isRequired, "You must enter your last name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50");

const emailValidator = (isRequired = false) =>
  requiredOrOptional("email", isRequired, "You must enter your email")
    .isEmail()
    .withMessage("Invalid email");

const phoneValidator = () =>
  body("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number");

const roleValidator = (isRequired) =>
  requiredOrOptional("role", isRequired, "Role is required")
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'");

export const getUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id format"),

  validatorMiddleware,
];

export const createUserValidator = [
  firstNameValidator(true),
  lastNameValidator(true),
  emailValidator(true),
  phoneValidator(),
  roleValidator(),

  body("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("The password must be at least 6 characters long"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm required ")
    .custom((val, { req }) => {
      if (val !== req.body.password)
        throw new Error("Password confirmation does not match password");
      return true;
    }),

  validatorMiddleware,
];

export const updateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id format"),

  firstNameValidator(),
  lastNameValidator(),
  emailValidator(),
  phoneValidator(),

  validatorMiddleware,
];

export const updateProfileValidator = [
  firstNameValidator(),
  lastNameValidator(),
  emailValidator(),
  phoneValidator(),

  validatorMiddleware,
];

export const updateProfilePasswordValidator = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("Current password required")
    .isLength({ min: 8 })
    .withMessage("The password must be at least 6 characters long"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password required")
    .isLength({ min: 8 })
    .withMessage("The New password must be at least 6 characters long"),

  body("newPasswordConfirm")
    .trim()
    .notEmpty()
    .withMessage("password confirm required ")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword)
        throw new Error("Password confirmation does not match new password");
      return true;
    }),

  validatorMiddleware,
];

export const updateUserRoleValidator = [
  param("id").isMongoId().withMessage("Invalid user id format"),

  roleValidator(true),

  validatorMiddleware,
];

export const deactivateUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id format"),

  validatorMiddleware,
];

export const deleteUserValidator = [
  param("id").isMongoId().withMessage("Invalid user id format"),

  validatorMiddleware,
];
