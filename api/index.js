import 'dotenv/config';
import connectDB from '../config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    // Standard Cross-Origin Security Configuration
    res.setHeader('Access-Control-Allow-Origin', 'https://finance-tracker-by-jubayer.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept');

    // Instantly terminate preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Lazy Connect to MongoDB Pool
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (err) {
            console.error('Database connection failure:', err);
            return res.status(500).json({ error: 'Database unreachable' });
        }
    }

    // Capture the incoming URL path safely
    const originalUrl = req.url || '';

    // Check if this request is destined for Better Auth
    if (originalUrl.includes('/auth') || req.headers['x-better-auth-path']) {
        try {
            const { auth } = await import('../config/auth.js');
            const { toNodeHandler } = await import('better-auth/node');

            // ⚠️ THE CORE CRITICAL REPAIR: Normalize the URL path string
            // If Vercel stripped the prefix, we rebuild it so Better Auth's router recognizes it.
            if (!originalUrl.startsWith('/api/auth')) {
                // Extracts everything after '/auth' (e.g., '/sign-in/social')
                const subPath = originalUrl.substring(originalUrl.indexOf('/auth') + 5);
                req.url = `/api/auth${subPath}`;
            }

            // Hand over the cleanly patched request object to Better Auth
            return toNodeHandler(auth)(req, res);
        } catch (err) {
            console.error('Better Auth execution crash:', err);
            return res.status(500).json({ error: 'Authentication processing breakdown' });
        }
    }

    // Health check route targets
    if (originalUrl === '/' || originalUrl === '/api' || originalUrl === '/api/') {
        return res.status(200).json({
            success: true,
            message: 'Finance Server is running natively on Vercel Edge'
        });
    }

    // Fallback for unmapped resource streams
    return res.status(404).json({ message: 'Route endpoint not found' });
}