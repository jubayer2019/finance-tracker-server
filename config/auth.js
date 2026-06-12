import { betterAuth } from "better-auth";

// Check for the variable immediately to prevent silent environment failures
if (!process.env.MONGO_URI) {
  throw new Error("CRITICAL CONFIGURATION ERROR: MONGO_URI environment variable is missing.");
}

export const auth = betterAuth({
  database: {
    // Pass the connection string directly so Better Auth doesn't rely on Mongoose's lifecycle
    url: process.env.MONGO_URI,
    type: "mongodb"
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    crossSubDomainCookie: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://finance-tracker-by-jubayer.vercel.app"
  ],
});