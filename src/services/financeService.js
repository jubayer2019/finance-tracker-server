const Transaction = require('../models/Transaction');

const calculateMetrics = async (userId) => {
  const transactions = await Transaction.find({ user: userId });
  
  let income = 0;
  let expenses = 0;
  
  transactions.forEach(t => {
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  });

  return {
    totalBalance: income - expenses,
    totalIncome: income,
    totalExpenses: expenses,
    transactionCount: transactions.length
  };
};

module.exports = { calculateMetrics };