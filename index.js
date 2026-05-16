import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
// Serves your html, css, and script.js from the public folder automatically
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Supabase and Polygon
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Endpoint 1: External Provider (Polygon API)
app.get('/api/market', async (req, res) => {
    const { ticker } = req.query;
    if (!ticker) return res.status(400).json({ error: "Ticker required" });

    try {
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_API_KEY}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Polygon fetch failed" });
    }
});

// Endpoint 2: Write Data to DB (Supabase)
app.post('/api/save', async (req, res) => {
    const { ticker } = req.body;
    const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
    
    if (error) return res.status(400).json(error);
    res.json({ success: true, data });
});

// Endpoint 3: Retrieve Data from DB (Supabase)
app.get('/api/watchlist', async (req, res) => {
    const { data, error } = await supabase.from('watchlist').select('*');
    
    if (error) return res.status(400).json(error);
    res.json(data);
});

// Fallback: If no API route is matched, serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// For local testing if you run `node index.js`
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;