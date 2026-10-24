const clearPasswordResetFields = (user) => {
  user.passwordResetHashCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetHashToken = undefined;
  user.passwordResetTokenExpires = undefined;
};

export default clearPasswordResetFields;
