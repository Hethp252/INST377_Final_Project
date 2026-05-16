import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// --- HARDCODED KEYS ---
const SUPABASE_URL = 'https://fksiydmwbyxxhzaihfqn.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2l5ZG13Ynl4eGh6YWloZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzQ1NjUsImV4cCI6MjA5NDMxMDU2NX0._GpovLiI9IxuCzaTx8quG3pewx_T4tzN9JVk17nXc6M';
const POLYGON_API_KEY = '2synVpra4oSdop1VoFfWynbj_aRgxnP0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CRITICAL: This tells the server to load your CSS and JS files so they actually work
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint 1: External Provider (Polygon API)
app.get('/api/market', async (req, res) => {
    const { ticker } = req.query;
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

// Fallback to send index.html if someone goes to a weird URL
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;