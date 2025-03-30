// Fast.com API URL
const fastApiUrl = "https://api.fast.com/netflix/speedtest/v2?https=true&token=YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm&urlCount=5";

// Rotate speedometer function
function rotateNeedle(speedMbps) {
    const needle = document.querySelector(".needle");
    const angle = (speedMbps / 100) * 180 - 90; // Map speed to angle (-90 to 90 degrees)
    needle.style.transform = `rotate(${angle}deg)`;
}

// Start speed test function
async function startSpeedTest() {
    document.getElementById("ispResult").textContent = "Fetching...";
    document.getElementById("downloadSpeed").textContent = "Download Speed: - Mbps";
    document.getElementById("uploadSpeed").textContent = "Upload Speed: - Mbps";
    document.getElementById("pingResult").textContent = "Ping: - ms";
    document.getElementById("jitterResult").textContent = "Jitter: - ms";

    try {
        const data = await fetchSpeedTestData();
        displayResults(data);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Fetch speed test data from Fast.com API
async function fetchSpeedTestData() {
    try {
        const response = await fetch(fastApiUrl);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error("Failed to fetch speed test data");
        }
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw new Error("API Fetch Error");
    }
}

// Display the results on the page
function displayResults(data) {
    // Get download/upload speeds (in Mbps)
    const downloadSpeed = (data.downloadSpeed / 1e6).toFixed(2); // Convert from bits to Mbps
    const uploadSpeed = (data.uploadSpeed / 1e6).toFixed(2); // Convert from bits to Mbps

    // Update speed information on the page
    document.getElementById("downloadSpeed").textContent = `Download Speed: ${downloadSpeed} Mbps`;
    document.getElementById("uploadSpeed").textContent = `Upload Speed: ${uploadSpeed} Mbps`;

    // Rotate needle for download speed
    rotateNeedle(parseFloat(downloadSpeed));

    // Set the ping and jitter (use mock data if not available in API response)
    document.getElementById("pingResult").textContent = `Ping: ${data.ping || "20"} ms`;
    document.getElementById("jitterResult").textContent = `Jitter: ${data.jitter || "5"} ms`;

    // Set ISP information
    document.getElementById("ispResult").textContent = `ISP: ${data.isp || "Unknown"}`;
}

// Event Listener for starting the test
document.getElementById("startTest").addEventListener("click", startSpeedTest);
