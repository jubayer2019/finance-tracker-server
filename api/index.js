import 'dotenv/config';
import connectDB from '../config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    // CORS
    res.setHeader(
        'Access-Control-Allow-Origin',
        'https://finance-tracker-by-jubayer.vercel.app'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,OPTIONS'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie, X-Requested-With, Accept'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Connect to MongoDB
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (err) {
            console.error('Database connection failure:', err);

            return res.status(500).json({
                error: 'Database unreachable'
            });
        }
    }

    // Better Auth routes
    if (req.url?.startsWith('/api/auth')) {
        try {
            const { auth } = await import('../config/auth.js');
            const { toNodeHandler } = await import('better-auth/node');

            return toNodeHandler(auth)(req, res);
        } catch (err) {
            console.error('Better Auth error:', err);

            return res.status(500).json({
                error: 'Authentication initialization failed'
            });
        }
    }

    // Health check route
    if (req.url === '/' || req.url === '/api') {
        return res.status(200).json({
            success: true,
            message: 'Finance Server is running'
        });
    }

    // Fallback
    return res.status(404).json({
        message: 'Route not found'
    });
}