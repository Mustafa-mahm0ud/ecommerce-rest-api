import bcrypt from "bcryptjs";

import userModel from "../../models/user-model.js";
import * as factory from "./crud-service.js";
import issueTokens from "./token-service.js";
import ApiError from "../../utils/api-error.js";

export const getDocs = factory.getDocs({
  Model: userModel,
  defaultFields:
    "firstName lastName email phone role active profileImage createdAt",
});
export const getDoc = factory.getDoc({ Model: userModel, modelName: "User" });
export const del = factory.del({ Model: userModel, modelName: "User" });
export const getById = factory.getById({ Model: userModel, modelName: "User" });
export const create = factory.create({ Model: userModel, modelName: "User" });
export const update = factory.update({ Model: userModel, modelName: "User" });

export const updateRole = async ({ id, role }) => {
  const doc = await userModel.findOneAndUpdate(
    { _id: id },
    { role },
    { returnDocument: "after", runValidators: true },
  );

  if (!doc) throw new ApiError(`user not found`, 404);

  return doc;
};

export const changePassword = async ({ id, reqBody }) => {
  const { currentPassword, newPassword } = reqBody;

  const user = await userModel.findOne({ _id: id }).select("+password");

  if (!user) throw new ApiError(`User not found`, 404);

  const correctPassword = await bcrypt.compare(currentPassword, user.password);

  if (!correctPassword) throw new ApiError("Incorrect current password", 400);

  user.password = newPassword;
  user.refreshTokenHash = undefined;
  user.loggedOutAt = Date.now();

  await user.save();

  return issueTokens(user);
};

export const deactivateUser = async ({ id }) => {
  const doc = await userModel.findOneAndUpdate(
    { _id: id },
    { active: false },
    { returnDocument: "after" },
  );
  if (!doc) throw new ApiError(`User not found`, 404);
};
