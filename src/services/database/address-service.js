import mongoose from "mongoose";

import userModel from "../../models/user-model.js";
import ApiError from "../../utils/api-error.js";

export const addAddress = async (userId, address) => {
  const newAddress = { ...address, _id: new mongoose.Types.ObjectId() };
  const doc = await userModel
    .findOneAndUpdate(
      { _id: userId },
      [
        {
          $set: {
            addresses: {
              $concatArrays: [
                "$addresses",
                [
                  {
                    $mergeObjects: [
                      newAddress,
                      { isDefault: { $eq: [{ $size: "$addresses" }, 0] } },
                    ],
                  },
                ],
              ],
            },
          },
        },
      ],
      { returnDocument: "after", updatePipeline: true },
    )
    .select("-_id addresses");

  if (!doc) throw new ApiError(`No user found with id: ${userId}`, 404);

  return doc;
};

export const updateAddress = async (userId, addressId, fieldsToUpdate = {}) => {
  const prefixedFields = Object.fromEntries(
    Object.entries(fieldsToUpdate).map(([key, value]) => [
      `addresses.$.${key}`,
      value,
    ]),
  );

  const doc = await userModel.updateOne(
    { _id: userId, "addresses._id": addressId },
    { $set: prefixedFields },
  );

  if (doc.matchedCount === 0)
    throw new ApiError(`No address found with id: ${addressId}`, 404);
};

export const removeAddress = async (userId, addressId) => {
  const doc = await userModel
    .findOne({
      _id: userId,
      "addresses._id": addressId,
    })
    .select("addresses.$");

  if (!doc) throw new ApiError(`No address found with id: ${addressId}`, 404);

  // Just keep it to provide query
  if (doc.addresses[0].isDefault)
    throw new ApiError(
      "Please add a default address before clearing the current default address",
      400,
    );

  const pullResult = await userModel.updateOne(
    {
      _id: userId,
      addresses: { $elemMatch: { _id: addressId, isDefault: false } },
    },
    {
      $pull: { addresses: { _id: addressId } },
    },
  );

  if (pullResult.matchedCount === 0)
    throw new ApiError(
      "Please add a default address before clearing the current default address",
      400,
    );
};

export const setDefaultAddress = async (userId, addressId) => {
  const addressObjectId = new mongoose.Types.ObjectId(addressId);

  const doc = await userModel.updateOne(
    { _id: userId, "addresses._id": addressId },
    [
      {
        $set: {
          addresses: {
            $map: {
              input: "$addresses",
              as: "addr",
              in: {
                $mergeObjects: [
                  "$$addr",
                  { isDefault: { $eq: ["$$addr._id", addressObjectId] } },
                ],
              },
            },
          },
        },
      },
    ],
    { updatePipeline: true },
  );

  if (doc.matchedCount === 0)
    throw new ApiError(`No address found with id: ${addressId}`, 404);
};
