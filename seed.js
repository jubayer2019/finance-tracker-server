require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Purging telemetry tables...");
    await User.deleteMany();
    await Transaction.deleteMany();

    console.log("Provisioning target root user account...");
    const testUser = await User.create({
      name: "Akash Sandbox Operator",
      email: "sandbox@finengine.io",
      password: "secure_sandbox_token_1122",
      monthlyBudget: 5000
    });

    console.log("Generating transaction logs...");
    await Transaction.create([
      { user: testUser._id, title: "Enterprise Contract Retainer", amount: 8500, type: "income", category: "Salary" },
      { user: testUser._id, title: "Production Cluster Framework", amount: 1200, type: "expense", category: "Utilities" },
      { user: testUser._id, title: "Stripe Payment Inflow", amount: 450, type: "income", category: "Freelance" },
      { user: testUser._id, title: "Office Leasehold Matrix", amount: 1800, type: "expense", category: "Rent" }
    ]);

    console.log("Mock data successfully injected.");
    process.exit(0);
  } catch (err) {
    console.error("Seed execution failed:", err);
    process.exit(1);
  }
};

seedDatabase();