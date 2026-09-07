import express from "express";

import { protect } from "../middlewares/auth-middleware.js";
import * as addressValidator from "../utils/validators/address-validator.js";
import * as addressController from "../controllers/address-controller.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(addressValidator.addAddressValidator, addressController.addAddress);

router
  .route("/:addressId")
  .patch(
    addressValidator.updateAddressValidator,
    addressController.updateAddress,
  )
  .delete(
    addressValidator.removeAddressValidator,
    addressController.removeAddress,
  );

router
  .route("/:addressId/default")
  .patch(
    addressValidator.setDefaultAddressValidator,
    addressController.setDefaultAddress,
  );

export default router;
