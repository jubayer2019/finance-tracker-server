import Transaction from "../models/Transaction.js";
import { calculateMetrics } from "../services/financeService.js";

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction) {
      res.status(404);
      throw new Error("Transaction record missing or unauthorized");
    }
    await transaction.deleteOne();
    res.json({ message: "Transaction successfully purged" });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req, res, next) => {
  try {
    const metrics = await calculateMetrics(req.user.id);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};
