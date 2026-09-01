import asyncHandler from "express-async-handler";

import * as userService from "../services/database/user-service.js";
import * as factory from "./crud-controller.js";

const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "profileImage",
  "password",
];

const ADMIN_USER_FIELDS = [...PROFILE_FIELDS, "role"];
/**
 *@desc        Get Users
 *@route       GET /api/v1/users
 *@access      Private (admin)
 */
export const getUsers = factory.getDocs(userService);

/**
 *@desc        Get Specific User
 *@route       GET /api/v1/users/:id
 *@access      Private (admin)
 */
export const getUser = factory.getDoc(userService);

/**
 *@desc        Get Current User Data
 *@route       GET /api/v1/users/profile
 *@access      Private (protect)
 */
export const getProfile = factory.getDoc(userService, null, true);

/**
 *@desc        Create User (just admin can  create a user with a role)
 *@route       POST /api/v1/users
 *@access      Private (admin)
 */
export const createUser = factory.create(ADMIN_USER_FIELDS, userService);

/**
 *@desc        Update Specific User (Admin Action)
 *@route       PATCH /api/v1/users/:id
 *@access      Private (admin)
 */
export const updateUser = factory.update(
  PROFILE_FIELDS,
  userService,
  "profileImage",
  "users",
);

/**
 *@desc        Update Logged User Data (Self)
 *@route       PATCH /api/v1/users/profile-update
 *@access      Private (protect)
 */
export const updateProfile = factory.update(
  PROFILE_FIELDS,
  userService,
  "profileImage",
  "users",
  true,
);

/**
 *@desc        Update User Role (Admin Action)
 *@route       PATCH /api/v1/users/:id/role
 *@access      Private (admin)
 */
export const updateUserRole = asyncHandler(async (req, res, next) => {
  const doc = await userService.updateRole(req.params.id, req.body.role);

  res.status(200).json({ status: "success", data: doc });
});

/**
 * @desc        Update Logged User Password (Self)
 * @route       PATCH /api/v1/users/profile/update-password
 *@access      Private (protect)
 */
export const updateProfilePassword = asyncHandler(async (req, res, next) => {
  await userService.changePassword(req.user._id, req.body);

  res.status(204).send();
});

/**
 *@desc        Deactivate Logged User (Soft Delete - Self)
 *@route       PATCH /api/v1/users/profile/deactivate
 *@access      Private (protect)
 */
export const deactivateProfile = asyncHandler(async (req, res, next) => {
  await userService.deactivateUser(req.user._id);

  res.status(204).send();
});

/**
 *@desc        Deactivate Specific User (Admin Action)
 *@route       PATCH /api/v1/users/:id/deactivate
 *@access      Private (admin)
 */
export const deactivateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await userService.deactivateUser(id);

  res.status(204).send();
});

/**
 *@desc        Delete User (Hard Delete)
 *@route       DELETE /api/v1/users/:id
 *@access      Private (admin)
 */
export const deleteUser = factory.del(userService, ["profileImage"], "users");
