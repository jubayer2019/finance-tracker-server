import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        type: "mongodb",
        url: process.env.MONGO_URI,
    },

    trustedOrigins: [
        "https://finance-tracker-by-jubayer.vercel.app",
    ],

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    advanced: {
        crossSubDomainCookie: true,
    },
});