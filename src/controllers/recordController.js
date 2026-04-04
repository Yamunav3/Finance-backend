const FinancialRecord = require("../models/FinancialRecord");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const createRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.create({
    ...req.body,
    createdBy: req.user._id,
    notes: req.body.notes || "",
  });

  res.status(201).json({
    message: "Record created successfully",
    record,
  });
});

const bulkCreateRecords = asyncHandler(async (req, res) => {
  const records = req.body.map((record) => ({
    ...record,
    createdBy: req.user._id,
    notes: record.notes || "",
  }));

  const createdRecords = await FinancialRecord.insertMany(records);

  res.status(201).json({
    message: "Records created successfully",
    records: createdRecords,
  });
});

const listRecords = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    search,
    fromDate,
    toDate,
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  } = req.query;

  const filter = { isDeleted: false };

  if (type) {
    filter.type = type;
  }
  if (category) {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { category: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } },
    ];
  }
  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) {
      filter.date.$gte = fromDate;
    }
    if (toDate) {
      filter.date.$lte = toDate;
    }
  }

  const skip = (page - 1) * limit;
  const sortDirection = order === "asc" ? 1 : -1;

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email role"),
    FinancialRecord.countDocuments(filter),
  ]);

  res.json({
    data: records,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false,
  }).populate("createdBy", "name email role");

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  res.json({ record });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  Object.assign(record, req.body);
  await record.save();

  res.json({
    message: "Record updated successfully",
    record,
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const record = await FinancialRecord.findOne({
    _id: req.params.id,
    isDeleted: false,
  });

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  record.isDeleted = true;
  await record.save();

  res.json({
    message: "Record deleted successfully",
  });
});

module.exports = {
  createRecord,
  bulkCreateRecords,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
