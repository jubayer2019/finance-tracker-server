const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: "none",
            secure: true
        }
    },
    baseURL: process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/api` : "http://localhost:5000/api",
    basePath: "/api",
});

console.log("Configured betterAuth");
