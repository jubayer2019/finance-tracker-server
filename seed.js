import "dotenv/config";
import mongoose from "mongoose";
import Transaction from "./models/Transaction.js";
import Budget from "./models/Budget.js";

const seedDatabase = async () => {
  try {
    const userId = process.env.SEED_USER_ID;
    if (!userId) {
      console.error(
        "Set SEED_USER_ID to an existing Better Auth user id before seeding."
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Purging existing telemetry for user...");
    await Transaction.deleteMany({ userId });
    await Budget.deleteMany({ userId });

    console.log("Provisioning budget...");
    await Budget.create({ userId, monthlyBudget: 5000 });

    console.log("Generating transaction logs...");
    await Transaction.create([
      { userId, title: "Enterprise Contract Retainer", amount: 8500, type: "income", category: "Salary" },
      { userId, title: "Production Cluster Framework", amount: 1200, type: "expense", category: "Utilities" },
      { userId, title: "Stripe Payment Inflow", amount: 450, type: "income", category: "Freelance" },
      { userId, title: "Office Leasehold Matrix", amount: 1800, type: "expense", category: "Rent" },
    ]);

    console.log("Mock data successfully injected.");
    process.exit(0);
  } catch (err) {
    console.error("Seed execution failed:", err);
    process.exit(1);
  }
};

seedDatabase();
