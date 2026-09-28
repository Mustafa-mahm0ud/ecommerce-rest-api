import crypto from "crypto";
import hashValue from "../helpers/hash-value.js";

const resolveResetCode = (resetCode = null) => {
  const code = resetCode ?? crypto.randomInt(100000, 1000000).toString();

  const hashedResetCode = hashValue(code);

  return { resetCode: code, hashedResetCode };
};

export default resolveResetCode;
