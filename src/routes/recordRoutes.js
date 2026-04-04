const express = require("express");
const {
  createRecord,
  bulkCreateRecords,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const validate = require("../middleware/validate");
const {
  createRecordSchema,
  bulkRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema,
} = require("../validators/recordValidators");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(auth);

const validateCreateRecordPayload = (req, res, next) => {
  const schema = Array.isArray(req.body) ? bulkRecordSchema : createRecordSchema;
  return validate(schema)(req, res, next);
};

const createSingleOrBulkRecord = (req, res, next) => {
  if (Array.isArray(req.body)) {
    return bulkCreateRecords(req, res, next);
  }
  return createRecord(req, res, next);
};

router.get("/", authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), validate(listRecordsQuerySchema), listRecords);
router.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.ANALYST), validate(recordIdParamSchema), getRecordById);
router.post("/", authorizeRoles(ROLES.ADMIN), validateCreateRecordPayload, createSingleOrBulkRecord);
router.patch("/:id", authorizeRoles(ROLES.ADMIN), validate(updateRecordSchema), updateRecord);
router.delete("/:id", authorizeRoles(ROLES.ADMIN), validate(recordIdParamSchema), deleteRecord);

module.exports = router;
