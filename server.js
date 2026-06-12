import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import connectDB from './config/db.js';
import { auth } from './config/auth.js';
import transactionRoutes from './routes/transactionRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();
await connectDB();

app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true 
}));

// ⚠️ CRITICAL: Mount Better Auth catch-all router BEFORE applying express.json() middleware
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Better Auth Server running on port ${PORT}`));