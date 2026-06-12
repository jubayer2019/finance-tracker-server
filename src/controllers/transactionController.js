const Transaction = require('../models/Transaction');
const financeService = require('../services/financeService');

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: date || Date.now()
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      res.status(404);
      throw new Error('Transaction record missing or unauthorized');
    }
    await transaction.deleteOne();
    res.json({ message: 'Transaction successfully purged' });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardSummary = async (req, res, next) => {
  try {
    const metrics = await financeService.calculateMetrics(req.user._id);
    res.json(metrics);
  } catch (error) {
    next(error);
  }
};