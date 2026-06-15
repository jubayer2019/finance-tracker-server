import "dotenv/config";
import connectDB from "../config/db.js";

let isDbConnected = false;

export default async function handler(req, res) {
    try {
        // CORS
        res.setHeader(
            "Access-Control-Allow-Origin",
            "https://finance-tracker-by-jubayer.vercel.app"
        );

        res.setHeader("Access-Control-Allow-Credentials", "true");

        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS"
        );

        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, Cookie, X-Requested-With, Accept"
        );

        // Handle preflight
        if (req.method === "OPTIONS") {
            return res.status(200).end();
        }

        // MongoDB Connection
        if (!isDbConnected) {
            await connectDB();
            isDbConnected = true;
        }

        // Health Check
        if (
            req.url === "/" ||
            req.url === "/api" ||
            req.url === "/api/"
        ) {
            return res.status(200).json({
                success: true,
                message: "Finance Tracker Server Running",
            });
        }

        // Better Auth Routes
        if (req.url.startsWith("/api/auth")) {
            const { auth } = await import("../config/auth.js");
            const { toNodeHandler } = await import("better-auth/node");

            return toNodeHandler(auth)(req, res);
        }

        return res.status(404).json({
            success: false,
            message: "Route not found",
        });
    } catch (error) {
        console.error("Server Error:", error);

        return res.status(500).json({
            success: false,
            error: error.message,
            stack:
                process.env.NODE_ENV === "development"
                    ? error.stack
                    : undefined,
        });
    }
}