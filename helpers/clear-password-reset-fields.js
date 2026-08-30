const clearPasswordResetFields = (user) => {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
};

export default clearPasswordResetFields;
