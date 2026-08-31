import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generate-token.js";

import hashValue from "../../helpers/hash-value.js";

const issueTokens = async (user) => {
  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshTokenHash = hashValue(refreshToken);

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

export default issueTokens;
