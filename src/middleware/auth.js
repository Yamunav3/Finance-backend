const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const auth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found for token");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive");
  }

  req.user = user;
  next();
});

module.exports = auth;
