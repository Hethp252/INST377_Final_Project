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
const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';
const FINNHUB_API_KEY = 'PASTE_YOUR_FINNHUB_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- EXPLICIT FRONTEND ROUTES (Fixes the broken buttons and CSS) ---
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'public', 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'public', 'script.js')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/about.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/project.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'project.html')));

// --- API ENDPOINT 1: External API (Finnhub) ---
app.get('/api/market', async (req, res) => {
    const { ticker } = req.query;
    try {
        const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        res.json({ results: [response.data] });
    } catch (err) {
        res.status(500).json({ error: "Finnhub fetch failed" });
    }
});

// --- API ENDPOINT 2: Write to DB (Supabase) ---
app.post('/api/save', async (req, res) => {
    const { ticker } = req.body;
    const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
    if (error) return res.status(400).json(error);
    res.json({ success: true, data });
});

// --- API ENDPOINT 3: Read from DB (Supabase) ---
app.get('/api/watchlist', async (req, res) => {
    const { data, error } = await supabase.from('watchlist').select('*');
    if (error) return res.status(400).json(error);
    res.json(data);
});

// Fallback
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;