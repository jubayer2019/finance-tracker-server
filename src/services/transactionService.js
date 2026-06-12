const Transaction = require("../models/Transaction");

/**
 * Create transaction
 */
exports.create = async (userId, payload) => {
  return await Transaction.create({
    userId,
    ...payload
  });
};

/**
 * Get all transactions
 */
exports.getAll = async (userId) => {
  return await Transaction.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Delete transaction
 */
exports.remove = async (id, userId) => {
  return await Transaction.findOneAndDelete({ _id: id, userId });
};

/**
 * Monthly income vs expense summary
 */
exports.monthlySummary = async (userId) => {
  const data = await Transaction.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return data;
};