export const PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "profileImage",
];

export const ADMIN_FIELDS = [...PROFILE_FIELDS, "role", "password"];

export const AUTH_RESPONSE_FIELDS = [
  "_id",
  "firstName",
  "lastName",
  "email",
  "role",
  "profileImageUrl",
];
