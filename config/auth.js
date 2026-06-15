import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI);

// Connect only once
await client.connect();

const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    trustedOrigins: [
        "https://finance-tracker-by-jubayer.vercel.app",
    ],

    advanced: {
        crossSubDomainCookie: true,
    },

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
});