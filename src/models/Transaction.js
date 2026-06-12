const mongoose = require("mongoose");

/**
 * Transaction schema for income/expense tracking
 */
const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    note: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);