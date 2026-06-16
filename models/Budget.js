import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    monthlyBudget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Budget || mongoose.model("Budget", budgetSchema);
