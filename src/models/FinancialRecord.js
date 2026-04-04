const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 600,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

financialRecordSchema.index({ type: 1, date: -1 });
financialRecordSchema.index({ category: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, date: -1 });

module.exports = mongoose.model("FinancialRecord", financialRecordSchema);
