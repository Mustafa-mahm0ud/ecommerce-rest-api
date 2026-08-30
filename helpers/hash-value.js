import crypto from "crypto";

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

export default hashValue;
