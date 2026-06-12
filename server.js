import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import connectDB from './config/db.js';
import transactionRoutes from './routes/transactionRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Global variable to persist connection across serverless function invocations
let isConnected = false;

// Serverless Database Connection Lifeline Wrapper
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error("Database lazy-loading connection failed:", err);
      return res.status(500).json({ message: "Database infrastructure unreachable" });
    }
  }
  next();
});

app.use(cors({ 
  origin: 'https://finance-tracker-by-jubayer.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight checks explicitly
app.options('*', cors());

// Dynamically import Better Auth only when an auth route is hit
app.all("/api/auth/*", async (req, res, next) => {
  const { auth } = await import("./config/auth.js");
  return toNodeHandler(auth)(req, res, next);
});

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

// Required for Vercel's serverless wrapper mapping execution
export default app; 

// Fallback for local development environments
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Development Server executing on port ${PORT}`));
}