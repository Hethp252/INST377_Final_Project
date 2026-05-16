import express from 'express';
import path from 'url';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = express.static ? path.dirname(__filename) : path.dirname(__filename);

const app = express();
app.use(express.json());

const SUPABASE_URL = 'PASTE_YOUR_SUPABASE_URL_HERE';
const SUPABASE_KEY = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(express.static(path.join(__dirname, 'public')));

// Backend Endpoint 1: Write to Watchlist
app.post('/api/save', async (req, res) => {
    const { ticker } = req.body;
    const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
    if (error) return res.status(400).json(error);
    res.json({ success: true, data });
});

// Backend Endpoint 2: Read Watchlist
app.get('/api/watchlist', async (req, res) => {
    const { data, error } = await supabase.from('watchlist').select('*');
    if (error) return res.status(400).json(error);
    res.json(data);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

export default app;