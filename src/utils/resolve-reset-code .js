import hashValue from "../helpers/hash-value.js";

const resolveResetCode = (resetCode = null) => {
  const code =
    resetCode ?? Math.floor(100000 + Math.random() * 900000).toString();

  const hashedResetCode = hashValue(code);

  return { resetCode: code, hashedResetCode };
};

export default resolveResetCode;
