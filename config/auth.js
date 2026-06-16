import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI);

// Connect once per server instance (top-level await is supported in ESM).
await client.connect();
const db = client.db();

const allowedOrigins = (
  process.env.CLIENT_URL || "https://finance-tracker-by-jubayer.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Only enable Google when credentials are actually configured, otherwise
// Better Auth throws on startup for a half-configured provider.
const socialProviders = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders,

  trustedOrigins: allowedOrigins,

  advanced: {
    // The frontend lives on a different origin than this API, so the session
    // cookie must be SameSite=None; Secure to be sent on cross-site XHR.
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
