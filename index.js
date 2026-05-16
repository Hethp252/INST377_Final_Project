import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Initialize Supabase once
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export default async function handler(req, res) {
    const { url, method } = req;

    // 1. External Provider (Polygon API)
    // URL expected: /api?ticker=AAPL
    if (url.includes('/api') && method === 'GET' && req.query.ticker) {
        try {
            const { ticker } = req.query;
            const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`);
            return res.status(200).json(response.data);
        } catch (err) {
            return res.status(500).json({ error: "Polygon fetch failed" });
        }
    }

    // 2. Write Data to DB (Supabase)
    if (url.includes('/api/save') && method === 'POST') {
        const { ticker } = req.body;
        const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
        if (error) return res.status(400).json(error);
        return res.status(200).json({ success: true, data });
    }

    // 3. Retrieve Data from DB (Supabase)
    if (url.includes('/api/watchlist') && method === 'GET') {
        const { data, error } = await supabase.from('watchlist').select('*');
        if (error) return res.status(400).json(error);
        return res.status(200).json(data);
    }

    res.status(404).json({ message: "Route not found" });
}