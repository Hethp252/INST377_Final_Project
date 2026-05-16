import express from 'express';
import path from 'url';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = express.static ? path.dirname(__filename) : path.dirname(__filename);

const app = express();
app.use(express.json());

const SUPABASE_URL = 'https://fksiydmwbyxxhzaihfqn.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2l5ZG13Ynl4eGh6YWloZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzQ1NjUsImV4cCI6MjA5NDMxMDU2NX0._GpovLiI9IxuCzaTx8quG3pewx_T4tzN9JVk17nXc6M';
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