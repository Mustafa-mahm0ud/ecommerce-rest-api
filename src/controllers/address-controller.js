import asyncHandler from "express-async-handler";

import pickAllowedFields from "../helpers/pick-allowed-fields.js";
import ALLOWED_ADDRESS_FIELDS from "../utils/constants/address-fields.js";
import * as addressService from "../services/database/address-service.js";

export const addAddress = asyncHandler(async (req, res, next) => {
  const doc = await addressService.addAddress({
    userId: req.user._id,
    address: pickAllowedFields(ALLOWED_ADDRESS_FIELDS, req.body),
  });

  res.status(201).json({ status: "success", data: doc });
});

export const updateAddress = asyncHandler(async (req, res, next) => {
  await addressService.updateAddress({
    userId: req.user._id,
    addressId: req.params.addressId,
    fieldsToUpdate: pickAllowedFields(ALLOWED_ADDRESS_FIELDS, req.body),
  });

  res.status(204).send();
});

export const removeAddress = asyncHandler(async (req, res, next) => {
  await addressService.removeAddress({
    userId: req.user._id,
    addressId: req.params.addressId,
  });

  res.status(204).send();
});

export const setDefaultAddress = asyncHandler(async (req, res, next) => {
  await addressService.setDefaultAddress({
    userId: req.user._id,
    addressId: req.params.addressId,
  });

  res.status(204).send();
});
