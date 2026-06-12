const Transaction = require("../models/Transaction");
const transactionService = require("../services/transactionService");

/**
 * Create new transaction
 */
exports.createTransaction = async (req, res, next) => {
  try {
    const data = await transactionService.create(req.user.id, req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all transactions for user
 */
exports.getTransactions = async (req, res, next) => {
  try {
    const data = await transactionService.getAll(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete transaction
 */
exports.deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.remove(req.params.id, req.user.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Monthly summary (income vs expense)
 */
exports.getMonthlySummary = async (req, res, next) => {
  try {
    const data = await transactionService.monthlySummary(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};