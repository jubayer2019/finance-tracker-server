/**
 * Express app configuration file
 */

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/**
 * Global middleware
 */
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "https://finance-tracker-by-jubayer.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const { toNodeHandler } = require("better-auth/node");
const auth = require("./config/betterAuth");

/**
 * Routes
 */
const authPaths = ["sign-in", "sign-up", "sign-out", "session", "callback", "error", "forget-password", "reset-password", "verify-email", "send-verification-email", "revoke-session", "social"];
app.all(authPaths.map(p => `/api/${p}/*`), (req, res) => toNodeHandler(auth)(req, res));
app.all(authPaths.map(p => `/api/${p}`), (req, res) => toNodeHandler(auth)(req, res));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

/**
 * Error handler (must be last)
 */
app.use(errorHandler);

module.exports = app;