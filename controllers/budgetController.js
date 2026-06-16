import Budget from "../models/Budget.js";

export const getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ userId: req.user.id });
    res.json({ monthlyBudget: budget?.monthlyBudget || 0 });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const monthlyBudget = Number(req.body.monthlyBudget) || 0;
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, monthlyBudget },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ monthlyBudget: budget.monthlyBudget });
  } catch (error) {
    next(error);
  }
};
