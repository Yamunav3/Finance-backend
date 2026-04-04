const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", auth, getMe);

module.exports = router;
