import 'dotenv/config';
import connectDB from '../config/db.js';

let isDbConnected = false;

export default async function handler(req, res) {
    // 1. Enforce Bulletproof CORS Handshake headers immediately
    res.setHeader('Access-Control-Allow-Origin', 'https://finance-tracker-by-jubayer.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept');

    // Instantly terminate preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Establish Lazy Connection to MongoDB Pool
    if (!isDbConnected) {
        try {
            await connectDB();
            isDbConnected = true;
        } catch (err) {
            console.error('Database connection failure:', err);
            return res.status(500).json({ error: 'Database unreachable' });
        }
    }

    // 3. Dynamic Safe URL Path Normalization
    const urlPath = req.url || '';
    
    // Check if this is an authentication request route
    if (urlPath.includes('/auth')) {
        try {
            const { auth } = await import('../config/auth.js');
            const { toNodeHandler } = await import('better-auth/node');

            // Explicitly force rewrite the internal req.url so Better Auth matches the endpoint
            if (!urlPath.startsWith('/api/auth')) {
                const cleanPath = urlPath.substring(urlPath.indexOf('/auth'));
                req.url = `/api${cleanPath}`;
            }

            // Execute Better Auth routing thread
            return toNodeHandler(auth)(req, res);
        } catch (err) {
            console.error('Better Auth execution crash:', err);
            return res.status(500).json({ 
                error: 'Authentication processing breakdown',
                details: err.message 
            });
        }
    }

    // Health check route targets
    if (urlPath === '/' || urlPath === '/api' || urlPath === '/api/') {
        return res.status(200).json({
            success: true,
            message: 'Finance Server running natively on Vercel Edge Serverless'
        });
    }

    return res.status(404).json({ message: 'Route endpoint not found' });
}