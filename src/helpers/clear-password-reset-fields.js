const clearPasswordResetFields = (user) => {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetTokenHash = undefined;
};

export default clearPasswordResetFields;
