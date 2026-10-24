import asyncHandler from "express-async-handler";

import * as userService from "../services/database/user-service.js";
import * as factory from "./crud-controller.js";
import {
  PROFILE_FIELDS,
  ADMIN_FIELDS,
} from "../utils/constants/user-fields.js";

/**
 *@desc        Get Users
 *@route       GET /api/v1/users
 *@access      Private (admin)
 */
export const getUsers = factory.getDocs({ service: userService });

/**
 *@desc        Get Specific User
 *@route       GET /api/v1/users/:id
 *@access      Private (admin)
 */
export const getUser = factory.getDoc({ service: userService });

/**
 *@desc        Get Current User Data
 *@route       GET /api/v1/users/profile
 *@access      Private (protect)
 */
export const getProfile = factory.getDoc({
  service: userService,
  getIdFromUser: true,
});

/**
 *@desc        Create User (just admin can  create a user with a role)
 *@route       POST /api/v1/users
 *@access      Private (admin)
 */
export const createUser = factory.create({
  fieldsToCreate: ADMIN_FIELDS,
  service: userService,
});

/**
 *@desc        Update Specific User (Admin Action)
 *@route       PATCH /api/v1/users/:id
 *@access      Private (admin)
 */
export const updateUser = factory.update({
  fieldsToUpdate: PROFILE_FIELDS,
  service: userService,
  imageField: "profileImage",
  folderName: "users",
});

/**
 *@desc        Update Logged User Data (Self)
 *@route       PATCH /api/v1/users/profile-update
 *@access      Private (protect)
 */
export const updateProfile = factory.update({
  fieldsToUpdate: PROFILE_FIELDS,
  service: userService,
  imageField: "profileImage",
  folderName: "users",
  getIdFromUser: true,
});

/**
 *@desc        Update User Role (Admin Action)
 *@route       PATCH /api/v1/users/:id/role
 *@access      Private (admin)
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const doc = await userService.updateRole({
    id: req.params.id,
    role: req.body.role,
  });

  res.status(200).json({ data: doc });
});

/**
 * @desc        Update Logged User Password (Self)
 * @route       PATCH /api/v1/users/profile/update-password
 *@access      Private (protect)
 */
export const updateProfilePassword = asyncHandler(async (req, res, next) => {
  await userService.changePassword({
    id: req.user._id,
    reqBody: req.body,
  });

  res.sendStatus(204);
});

/**
 *@desc        Deactivate Logged User (Soft Delete - Self)
 *@route       PATCH /api/v1/users/profile/deactivate
 *@access      Private (protect)
 */
export const deactivateProfile = asyncHandler(async (req, res, next) => {
  await userService.deactivateUser({ id: req.user._id });

  res.status(204).send();
});

/**
 *@desc        Deactivate Specific User (Admin Action)
 *@route       PATCH /api/v1/users/:id/deactivate
 *@access      Private (admin)
 */
export const deactivateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await userService.deactivateUser({ id });

  res.status(204).send();
});

/**
 *@desc        Delete User (Hard Delete)
 *@route       DELETE /api/v1/users/:id
 *@access      Private (admin)
 */
export const deleteUser = factory.del({
  service: userService,
  imageFields: ["profileImage"],
  folderName: "users",
});
