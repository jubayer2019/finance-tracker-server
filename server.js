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

// 1. CONFIGURE PRODUCTION CORS SAFE-LIST
const allowedOrigins = [
  'http://localhost:3000',
  'https://finance-tracker-by-jubayer.vercel.app' // Your frontend URL
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow server-to-server or tools like Postman (which don't have an origin header)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by security boundary: CORS policy violation.'));
    }
  },
  credentials: true, // Crucial for Better Auth session cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// 2. EXPLICITLY HANDLE OPTIONS PREFLIGHT TERMINATION
// Better Auth requires explicit options parsing over cross-subdomains
app.options('*', cors());

// Mount Better Auth catch-all router
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Better Auth Server running on port ${PORT}`));