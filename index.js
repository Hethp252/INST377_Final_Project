import express from 'express';
import path from 'path'; // FIX: Changed from 'url' to 'path'
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // FIX: Standardized path resolution

const app = express();
app.use(express.json());

// ==========================================
// 🔑 HARDCODED API KEYS (PASTE YOURS HERE)
// ==========================================
const SUPABASE_URL = 'https://fksiydmwbyxxhzaihfqn.supabase.co/rest/v1/';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2l5ZG13Ynl4eGh6YWloZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzQ1NjUsImV4cCI6MjA5NDMxMDU2NX0._GpovLiI9IxuCzaTx8quG3pewx_T4tzN9JVk17nXc6M';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Serves HTML, CSS, JS out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint 1: Database Write (Save Ticker to Supabase)
app.post('/api/save', async (req, res) => {
    const { ticker } = req.body;
    
    // NOTE: This assumes your column name in Supabase is exactly 'symbol'
    const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
    
    if (error) {
        console.error("Supabase Write Error:", error);
        return res.status(400).json(error);
    }
    res.json({ success: true, data });
});

// Endpoint 2: Database Read (Retrieve Watchlist from Supabase)
app.get('/api/watchlist', async (req, res) => {
    const { data, error } = await supabase.from('watchlist').select('*');
    
    if (error) {
        console.error("Supabase Read Error:", error);
        return res.status(400).json(error);
    }
    res.json(data);
});

// Fallback Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;