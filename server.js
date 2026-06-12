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

// Dynamic framework handling for local testing & production fallback
const originTarget = process.env.NODE_ENV === 'production' 
  ? 'https://finance-tracker-by-jubayer.vercel.app' 
  : 'http://localhost:3000';

app.use(cors({ 
  origin: originTarget,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// Explicit interceptor fallback for local development preflights
app.options('*', cors());

// Mount Better Auth catch-all router
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Better Auth Server running on port ${PORT}`));