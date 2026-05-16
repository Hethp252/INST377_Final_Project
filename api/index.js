import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const SUPABASE_URL = 'https://fksiydmwbyxxhzaihfqn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2l5ZG13Ynl4eGh6YWloZnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MzQ1NjUsImV4cCI6MjA5NDMxMDU2NX0._GpovLiI9IxuCzaTx8quG3pewx_T4tzN9JVk17nXc6M';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post('/api/save', async (req, res) => {
    const { ticker } = req.body;
    const { data, error } = await supabase.from('watchlist').insert([{ symbol: ticker }]);
    
    if (error) return res.status(400).json(error);
    res.json({ success: true, data });
});

app.get('/api/watchlist', async (req, res) => {
    const { data, error } = await supabase.from('watchlist').select('*');
    
    if (error) return res.status(400).json(error);
    res.json(data);
});

if (!process.env.VERCEL) {
    app.listen(3000);
}

export default app;