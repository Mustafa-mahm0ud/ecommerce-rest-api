const clearPasswordResetFields = (user) => {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpires = undefined;
};

export default clearPasswordResetFields;
