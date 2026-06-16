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

// Origins allowed to send credentialed requests
const allowedOrigins = (
  process.env.CLIENT_URL || "https://finance-tracker-by-jubayer.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin header (Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Ensure MongoDB connection exists
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

/*
|--------------------------------------------------------------------------
| Handle Better Auth preflight requests manually
|--------------------------------------------------------------------------
*/
app.options("/api/auth/*splat", (req, res) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie, X-Requested-With, Accept"
  );

  res.setHeader("Access-Control-Allow-Credentials", "true");

  return res.sendStatus(200);
});

/*
|--------------------------------------------------------------------------
| Better Auth routes
|--------------------------------------------------------------------------
*/
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON parser
app.use(express.json());

// Application routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use(errorHandler);

export default app;
