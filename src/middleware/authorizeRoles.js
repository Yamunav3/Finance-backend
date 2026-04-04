const ApiError = require("../utils/ApiError");

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, "Insufficient permissions");
  }

  next();
};

module.exports = authorizeRoles;
