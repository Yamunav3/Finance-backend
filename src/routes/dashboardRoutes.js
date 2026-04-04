const express = require("express");
const { getSummary } = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.get("/summary", auth, authorizeRoles(ROLES.ADMIN, ROLES.ANALYST,ROLES.VIEWER), getSummary);

module.exports = router;
