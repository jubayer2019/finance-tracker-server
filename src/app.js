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
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

/**
 * Error handler (must be last)
 */
app.use(errorHandler);

module.exports = app;