import crypto from "crypto";

import hashValue from "../helpers/hash-value.js";

const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = hashValue(resetToken);

  return { resetToken, resetTokenHash };
};

export default generateResetToken;
