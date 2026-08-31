import bcrypt from "bcryptjs";

import userModel from "../../models/user-model.js";
import * as factory from "./crud-service.js";
import ApiError from "../../utils/api-error.js";

export const getDocs = factory.getDocs(userModel);
export const getDoc = factory.getDoc(userModel);
export const del = factory.del(userModel);
export const getById = factory.getById(userModel);
export const create = factory.create(userModel);
export const update = factory.update(userModel);

export const updateRole = async (id, role) => {
  const doc = await userModel.findOneAndUpdate(
    { _id: id },
    { role },
    { returnDocument: "after", runValidators: true },
  );

  if (!doc) throw new ApiError(`No user found with id: ${id}`, 404);

  return doc;
};

export const changePassword = async (id, reqBody) => {
  const { currentPassword, newPassword } = reqBody;

  const user = await userModel.findOne({ _id: id }).select("+password");

  if (!user) throw new ApiError(`No user found with id: ${id}`, 404);

  const isCorrectPassword = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isCorrectPassword)
    throw new ApiError("Incorrect current password!", 400);

  user.password = newPassword;

  await user.save();
};

export const deactivateUser = async (id) => {
  const doc = await userModel.findOneAndUpdate(
    { _id: id },
    { active: false },
    { returnDocument: "after" },
  );
  if (!doc) throw new ApiError(`No user found with id: ${id}`, 404);
};
