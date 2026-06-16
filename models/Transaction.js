import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Better Auth user id (string), used to scope every query per user.
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Salary",
        "Freelance",
        "Investments",
        "Food",
        "Rent",
        "Utilities",
        "Entertainment",
        "Other",
      ],
    },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
