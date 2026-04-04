const express = require("express");
const {
  createUser,
  bulkCreateUsers,
  listUsers,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const validate = require("../middleware/validate");
const {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
  bulkUserSchema,
} = require("../validators/userValidators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

const validateCreatePayload = (req, res, next) => {
  const schema = Array.isArray(req.body) ? bulkUserSchema : createUserSchema;
  return validate(schema)(req, res, next);
};

const createSingleOrBulkUser = (req, res, next) => {
  if (Array.isArray(req.body)) {
    return bulkCreateUsers(req, res, next);
  }
  return createUser(req, res, next);
};

router.use(auth, authorizeRoles(ROLES.ADMIN));
router.post(
  "/bulk",
  auth,
  authorizeRoles(ROLES.ADMIN),
  validate(bulkUserSchema),
  bulkCreateUsers
);
router.post("/", validateCreatePayload, createSingleOrBulkUser);
router.get("/", validate(listUsersQuerySchema), listUsers);
router.get("/:id", validate(userIdParamSchema), getUserById);
router.patch("/:id", validate(updateUserSchema), updateUser);

module.exports = router;
