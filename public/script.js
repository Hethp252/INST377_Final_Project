var currentChart = null;
var activeTicker = "";

// Load watchlist when page opens
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("watchlistItems")) {
        loadWatchlist();
    }
});

// Analyze Button Function
async function fetchStockData() {
    var ticker = document.getElementById("tickerInput").value.toUpperCase().trim();
    if (!ticker) return alert("Please enter a stock ticker.");

    try {
        var response = await fetch('/api/market?ticker=' + ticker);
        var data = await response.json();

        if (!data.results || data.results.length === 0) {
            return alert("No data found for that ticker.");
        }

        var stockResult = data.results[0];
        activeTicker = ticker;

        // Show data on screen
        document.getElementById("displayTicker").innerText = ticker;
        document.getElementById("closePrice").innerText = "$" + stockResult.c;
        document.getElementById("stockDetails").classList.remove("hidden");

        // Attach save function to button
        document.getElementById("saveBtn").onclick = function() {
            saveToWatchlist(ticker);
        };

        renderChart(stockResult);
    } catch (err) {
        console.error(err);
    }
}

// Chart.js Library
function renderChart(result) {
    var ctx = document.getElementById('stockChart').getContext('2d');
    if (currentChart) currentChart.destroy();

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Open', 'High', 'Low', 'Close'],
            datasets: [{
                label: activeTicker + ' Price (USD)',
                data: [result.o, result.h, result.l, result.c],
                backgroundColor: ['#60a5fa', '#34d399', '#f87171', '#fbbf24']
            }]
        }
    });
}

// Save Button Function
async function saveToWatchlist(ticker) {
    try {
        var response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: ticker })
        });
        var result = await response.json();
        if (result.success) loadWatchlist();
    } catch (err) {
        console.error(err);
    }
}

// Load Watchlist Function
async function loadWatchlist() {
    try {
        var response = await fetch('/api/watchlist');
        var list = await response.json();
        
        var container = document.getElementById("watchlistItems");
        container.innerHTML = "";

        list.forEach(function(item) {
            var li = document.createElement("li");
            li.className = "watchlist-item";
            li.innerText = item.symbol;
            container.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}