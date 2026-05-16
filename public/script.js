var currentChart = null;
var activeTicker = "";

// On page load, fetch the existing database records
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("watchlistItems")) {
        loadWatchlist();
    }
});

// Endpoint Call 1: Fetch from External Provider (via Backend)
async function fetchStockData() {
    var ticker = document.getElementById("tickerInput").value.toUpperCase().trim();
    if (!ticker) return alert("Please enter a valid stock ticker symbol.");

    try {
        var response = await fetch('/api?ticker=' + ticker);
        var data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("No data found for that ticker symbol.");
            return;
        }

        var stockResult = data.results[0];
        activeTicker = ticker;

        // Reveal the details card
        document.getElementById("displayTicker").innerText = ticker;
        document.getElementById("closePrice").innerText = "$" + stockResult.c;
        document.getElementById("stockDetails").classList.remove("hidden");

        // Set up the button listener to write to database
        document.getElementById("saveBtn").onclick = function() {
            saveToWatchlist(ticker);
        };

        renderChart(stockResult);
    } catch (err) {
        console.error("Error retrieving market indicators:", err);
    }
}

// JS Library 1: Rendering metrics natively with Chart.js
function renderChart(result) {
    var ctx = document.getElementById('stockChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Open', 'High', 'Low', 'Close'],
            datasets: [{
                label: activeTicker + ' Technical Boundaries (USD)',
                data: [result.o, result.h, result.l, result.c],
                backgroundColor: ['#60a5fa', '#34d399', '#f87171', '#fbbf24'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Endpoint Call 2: Write Data to Supabase (via Backend)
async function saveToWatchlist(ticker) {
    try {
        var response = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticker: ticker })
        });
        var result = await response.json();
        
        if (result.success) {
            loadWatchlist(); // Refresh the visible watchlist container
        } else {
            alert("Failed saving asset to profile.");
        }
    } catch (err) {
        console.error("Database compilation anomaly:", err);
    }
}

// Endpoint Call 3: Retrieve Data from Supabase (via Backend)
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
        console.error("Failed downloading database elements:", err);
    }
}