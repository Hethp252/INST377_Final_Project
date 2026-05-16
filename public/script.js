let chart;

async function getStocks(val) {
    const symbol = (val || document.getElementById('ticker').value).toUpperCase();
    if (!symbol) return;
    const days = document.getElementById('days').value;
    const apiKey = 'cK60kGvVcqsXfh86boN7TYYmcTIvQ_fm';
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));
    
    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}?apiKey=${apiKey}`);
    const data = await res.json();
    
    if(!data.results) return alert("Ticker not found.");

    if(document.getElementById('stockDetails')) {
        document.getElementById('displayTicker').innerText = symbol;
        document.getElementById('stockDetails').classList.remove('hidden');
        document.getElementById('saveBtn').onclick = function() {
            saveToWatchlist(symbol);
        };
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.results.map(i => new Date(i.t).toLocaleDateString()),
            datasets: [{ label: symbol, data: data.results.map(i => i.c), borderColor: '#E62C03', fill: false }]
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("watchlistItems")) {
        loadWatchlist();
    }
});

async function saveToWatchlist(ticker) {
    try {
        const response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: ticker })
        });

        if (!response.ok) return alert("Server Error " + response.status);

        const result = await response.json();
        if (result.success) {
            alert(ticker + " saved to your Supabase Database!");
            loadWatchlist();
        }
    } catch (err) {
        alert("Fetch failed completely.");
    }
}

async function loadWatchlist() {
    try {
        const response = await fetch('/api/watchlist');
        const list = await response.json();
        
        const container = document.getElementById("watchlistItems");
        container.innerHTML = "";

        if (!list || list.length === 0) {
            container.innerHTML = "<li>Database empty</li>";
            return;
        }

        list.forEach(function(item) {
            const li = document.createElement("li");
            li.className = "watchlist-item";
            li.innerText = item.symbol;
            container.appendChild(li);
        });
    } catch (err) {
         // Silently fail on error to keep production clean
    }
}