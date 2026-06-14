import 'dotenv/config';
import connectDB from '../config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    // Standard Cross-Origin Security Layout
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

    // ⚠️ THE REPAIR: Broaden match sequence to support serverless URL masking
    const urlPath = req.url || '';
    if (urlPath.includes('/api/auth') || urlPath.startsWith('/auth')) {
        try {
            const { auth } = await import('../config/auth.js');
            const { toNodeHandler } = await import('better-auth/node');

            return toNodeHandler(auth)(req, res);
        } catch (err) {
            console.error('Better Auth error:', err);
            return res.status(500).json({ error: 'Authentication initialization failed' });
        }
    }

    // Health check route targets
    if (urlPath === '/' || urlPath === '/api' || urlPath === '/api/') {
        return res.status(200).json({
            success: true,
            message: 'Finance Server is running natively on Vercel Edge'
        });
    }

    // Fallback
    return res.status(404).json({ message: 'Route not found' });
}