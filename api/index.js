import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import connectDB from "../config/db.js";
import { auth } from "../config/auth.js";
import transactionRoutes from "../routes/transactionRoutes.js";
import budgetRoutes from "../routes/budgetRoutes.js";
import { errorHandler } from "../middleware/errorMiddleware.js";

const app = express();

app.set("trust proxy", true);

// Origins allowed to send credentialed requests. Configure CLIENT_URL on the
// server project as a comma-separated list of frontend origins.
const allowedOrigins = (
  process.env.CLIENT_URL || "https://finance-tracker-by-jubayer.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser / same-origin requests (no Origin header) and any
      // explicitly whitelisted frontend origin.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Ensure a MongoDB connection exists before any route runs. Mongoose caches the
// connection, so this is effectively a no-op after the first cold-start call.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Health check
app.get(["/", "/api", "/api/"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Finance Tracker Server Running",
  });
});

// Better Auth HTTP handler. MUST be mounted before express.json() so Better Auth
// can read the raw request body. The "/*splat" wildcard is the Express 5 syntax.
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON body parsing for the application routes below.
app.use(express.json());

// Application routes (all protected via Better Auth session cookies).
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralized error handler
app.use(errorHandler);

export default app;
