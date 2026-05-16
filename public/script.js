// Fetch random quote on page load
let chart;

// Your exact Polygon range function
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

    // Show the save section once data successfully returns
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

// Automatically load your watchlist when dashboard opens
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("watchlistItems")) {
        loadWatchlist();
    }
});

// Database Endpoint Call: Save to Supabase
async function saveToWatchlist(ticker) {
    try {
        console.log("Attempting to save:", ticker);

        var response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: ticker })
        });

        // Grab the raw text from the server FIRST
        var rawText = await response.text();
        console.log("Raw Server Response:", rawText);

        // If the server failed (e.g., 404, 500, 502)
        if (!response.ok) {
            console.error("Server threw an error status:", response.status);
            return alert("Server Error " + response.status + "\nCheck Inspect Element Console!");
        }

        // If it succeeded, safely parse the JSON
        var result = JSON.parse(rawText);
        
        if (result.success) {
            alert(ticker + " saved to your Supabase Database!");
            loadWatchlist();
        }
    } catch (err) {
        console.error("Database save failed:", err);
        alert("Fetch failed completely. Check Vercel logs.");
    }
}

// Database Endpoint Call: Retrieve from Supabase
async function loadWatchlist() {
    try {
        var response = await fetch('/api/watchlist');
        var list = await response.json();
        
        var container = document.getElementById("watchlistItems");
        container.innerHTML = "";

        if (!list || list.length === 0) {
            container.innerHTML = "<li>Database empty</li>";
            return;
        }

        list.forEach(function(item) {
            var li = document.createElement("li");
            li.className = "watchlist-item";
            li.innerText = item.symbol;
            container.appendChild(li);
        });
    } catch (err) {
        console.error("Database view failed:", err);
    }
}