import 'dotenv/config';
import { toNodeHandler } from "better-auth/node";
import connectDB from './config/db.js';

// Global connection state to preserve database allocation across serverless invocations
let isDbConnected = false;

export default async function handler(req, res) {
  // 1. Instantly respond to CORS Preflight checks at the root gateway step
  res.setHeader('Access-Control-Allow-Origin', 'https://finance-tracker-by-jubayer.vercel.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Establish database connection lazily
  if (!isDbConnected) {
    try {
      await connectDB();
      isDbConnected = true;
    } catch (err) {
      console.error("Database connection failure:", err);
      return res.status(500).json({ error: "Database unreachable" });
    }
  }

  // 3. Directly hand the request payload over to Better Auth's core processing engine
  if (req.url.startsWith('/api/auth')) {
    const { auth } = await import("./config/auth.js");
    return toNodeHandler(auth)(req, res);
  }

  // Fallback handler for non-auth requests
  return res.status(404).json({ message: "Route node unmapped" });
}