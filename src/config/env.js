const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8080,

  mongoUri:
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/finance_dashboard",

  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  corsOrigin: process.env.CORS_ORIGIN || "*",

  rateLimitWindowMs:
    Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,

  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 200,
};