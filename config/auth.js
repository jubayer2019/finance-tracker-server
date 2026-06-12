import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
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
    "https://finance-tracker-by-jubayer.vercel.app"
  ],
});