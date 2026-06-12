import { betterAuth } from "better-auth";
import mongoose from "mongoose";

export const auth = betterAuth({
  database: {
    db: mongoose.connection.db,
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
  // Update this array to include your production deployment URL
  trustedOrigins: [
    "http://localhost:3000",
    "https://finance-tracker-by-jubayer.vercel.app"
  ],
});