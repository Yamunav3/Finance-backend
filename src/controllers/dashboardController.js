const FinancialRecord = require("../models/FinancialRecord");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (_req, res) => {
  const baseFilter = { isDeleted: false };

  const [totals, categoryTotals, recentActivity, monthlyTrends] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    FinancialRecord.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
        },
      },
      { $sort: { category: 1 } },
    ]),
    FinancialRecord.find(baseFilter)
      .sort({ date: -1, createdAt: -1 })
      .limit(10)
      .populate("createdBy", "name role"),
    FinancialRecord.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]),
  ]);

  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpenses = totals.find((item) => item._id === "expense")?.total || 0;

  res.json({
    summary: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryTotals,
      recentActivity,
      monthlyTrends,
    },
  });
});

module.exports = {
  getSummary,
};
