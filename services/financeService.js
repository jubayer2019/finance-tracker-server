import Transaction from "../models/Transaction.js";

export const calculateMetrics = async (userId) => {
  const transactions = await Transaction.find({ userId });

  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  });

  return {
    totalBalance: income - expenses,
    totalIncome: income,
    totalExpenses: expenses,
    transactionCount: transactions.length,
  };
};
