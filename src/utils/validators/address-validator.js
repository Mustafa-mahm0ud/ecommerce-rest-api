import { param, body } from "express-validator";

import validatorMiddleware from "../../middlewares/validator-middleware.js";
import requireAtLeastOneField from "../require-at-least-one-field.js";
import ALLOWED_ADDRESS_FIELDS from "../constants/address-fields.js";

const requiredOrOptional = (field, isRequired, msg) =>
  isRequired
    ? body(field).trim().notEmpty().withMessage(msg)
    : body(field).trim().optional();

const aliasValidator = (isRequired = false) =>
  requiredOrOptional("alias", isRequired, "You must enter the alias")
    .isLength({ min: 2, max: 50 })
    .withMessage("Alias must be between 2 and 50 characters");

const detailsValidator = (isRequired = false) =>
  requiredOrOptional("details", isRequired, "You must enter the details")
    .isLength({ min: 5, max: 200 })
    .withMessage("Details must be between 5 and 200 characters");

const cityValidator = (isRequired = false) =>
  requiredOrOptional("city", isRequired, "You must enter the city")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters");

const landmarkValidator = () =>
  body("landmark")
    .trim()
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Landmark must be between 3 and 100 characters");

const recipientFirstNameValidator = (isRequired = false) =>
  requiredOrOptional(
    "recipientFirstName",
    isRequired,
    "You must enter the recipient's first name",
  )
    .isLength({ min: 2, max: 50 })
    .withMessage("Recipient first name must be between 2 and 50 characters");

const recipientLastNameValidator = (isRequired = false) =>
  requiredOrOptional(
    "recipientLastName",
    isRequired,
    "You must enter the recipient's last name",
  )
    .isLength({ min: 2, max: 50 })
    .withMessage("Recipient last name must be between 2 and 50 characters");

const phoneValidator = (isRequired = false) =>
  requiredOrOptional(
    "phone",
    isRequired,
    "You must enter the recipient's phone number",
  )
    .isMobilePhone(["ar-EG"])
    .withMessage("Phone number must be a valid Egyptian mobile number");

const addressIdParamValidator = () =>
  param("addressId").isMongoId().withMessage("Invalid address id format");

export const addAddressValidator = [
  aliasValidator(true),
  detailsValidator(true),
  cityValidator(true),
  landmarkValidator(),
  recipientFirstNameValidator(true),
  recipientLastNameValidator(true),
  phoneValidator(true),

  validatorMiddleware,
];

export const updateAddressValidator = [
  addressIdParamValidator(),

  requireAtLeastOneField(ALLOWED_ADDRESS_FIELDS),

  aliasValidator(),
  detailsValidator(),
  cityValidator(),
  landmarkValidator(),
  recipientFirstNameValidator(),
  recipientLastNameValidator(),
  phoneValidator(),

  validatorMiddleware,
];

export const removeAddressValidator = [
  addressIdParamValidator(),

  validatorMiddleware,
];

export const setDefaultAddressValidator = [
  addressIdParamValidator(),

  validatorMiddleware,
];
