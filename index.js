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
const FINNHUB_API_KEY = 'd84d1epr01qutij8n8igd84d1epr01qutij8n8j0'; // Put your Finnhub Key here

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Makes sure your CSS and frontend script files load perfectly
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint 1: External Provider (Finnhub API)
app.get('/api/market', async (req, res) => {
    const { ticker } = req.query;
    if (!ticker) return res.status(400).json({ error: "Ticker required" });

    try {
        // Updated URL string to connect to Finnhub's quote endpoint
        const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(url);
        
        // Finnhub returns { o: 150, h: 155, ... }. We wrap it in a results array 
        // so your existing frontend script.js can read it without changing any logic!
        res.json({ results: [response.data] });
    } catch (err) {
        res.status(500).json({ error: "Finnhub fetch failed" });
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

// Fallback to send index.html if someone goes to a root route or deep links
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;