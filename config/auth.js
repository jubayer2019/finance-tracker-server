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
  // Essential for decoupled cross-origin session storage sharing
  advanced: {
    crossSubDomainCookie: true,
  },
  trustedOrigins: [process.env.CLIENT_URL || "http://localhost:3000"],
});