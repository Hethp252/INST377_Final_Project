var currentChart = null;
var activeTicker = "";

// Automatically fetch your saved database stocks when the page loads
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("watchlistItems")) {
        loadWatchlist();
    }
});

// Run Finnhub API
async function fetchStockData() {
    var ticker = document.getElementById("tickerInput").value.toUpperCase().trim();
    if (!ticker) return alert("Please enter a stock ticker.");

    try {
        var response = await fetch('/api/market?ticker=' + ticker);
        var data = await response.json();

        if (!data.results || data.results.length === 0 || !data.results[0].c) {
            return alert("No data found for that ticker.");
        }

        var stockResult = data.results[0];
        activeTicker = ticker;

        // Show data and unhide the section
        document.getElementById("displayTicker").innerText = ticker;
        document.getElementById("closePrice").innerText = "$" + stockResult.c;
        document.getElementById("stockDetails").style.display = "block"; // Reveals the save button and chart

        // Attach function to the save button
        document.getElementById("saveBtn").onclick = function() {
            saveToWatchlist(ticker);
        };

        renderChart(stockResult);
    } catch (err) {
        console.error(err);
    }
}

// Render Chart
function renderChart(result) {
    var ctx = document.getElementById('stockChart').getContext('2d');
    if (currentChart) currentChart.destroy();

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Open', 'High', 'Low', 'Current'],
            datasets: [{
                label: activeTicker + ' Price (USD)',
                data: [result.o, result.h, result.l, result.c],
                backgroundColor: ['#60a5fa', '#34d399', '#f87171', '#fbbf24']
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// Write to Supabase
async function saveToWatchlist(ticker) {
    try {
        var response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: ticker })
        });
        var result = await response.json();
        if (result.success) {
            alert(ticker + " saved to database!");
            loadWatchlist(); // Refresh list on screen
        }
    } catch (err) {
        console.error(err);
    }
}

// Read from Supabase
async function loadWatchlist() {
    try {
        var response = await fetch('/api/watchlist');
        var list = await response.json();
        
        var container = document.getElementById("watchlistItems");
        container.innerHTML = "";

        list.forEach(function(item) {
            var li = document.createElement("li");
            li.style.cssText = "background: #e2e8f0; padding: 5px 10px; border-radius: 20px; font-weight: bold;";
            li.innerText = item.symbol;
            container.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}