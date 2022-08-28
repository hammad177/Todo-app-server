const jwt = require("jsonwebtoken");

exports.generateRefreshTokens = (payload) => {
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
  });
  return refreshToken;
};

exports.generateAccessTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
    expiresIn: "15m",
  });
  return accessToken;
};

exports.verifyTokens = (type, token) => {
  if (type === "access") {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY);
  }
  if (type === "refresh") {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY);
  }
  return false;
};
