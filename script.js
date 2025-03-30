// Mocked API URL (In real use, you could replace this with a real speedtest API endpoint)
const downloadApiUrl = "https://api.mockspeedtest.com/download";
const uploadApiUrl = "https://api.mockspeedtest.com/upload";

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
        await testDownloadSpeed();
        await testUploadSpeed();
        await getISPInfo();
    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Test download speed
async function testDownloadSpeed() {
    try {
        const response = await fetch(downloadApiUrl);
        const data = await response.json();

        if (response.ok) {
            const downloadSpeed = data.speed; // Assuming API returns speed in Mbps
            document.getElementById("downloadSpeed").textContent = `Download Speed: ${downloadSpeed.toFixed(2)} Mbps`;
            rotateNeedle(downloadSpeed);
        } else {
            throw new Error('Failed to fetch download speed');
        }
    } catch (error) {
        document.getElementById("downloadSpeed").textContent = "Download Speed: Error";
        console.error("Download test error:", error);
    }
}

// Test upload speed
async function testUploadSpeed() {
    try {
        const response = await fetch(uploadApiUrl);
        const data = await response.json();

        if (response.ok) {
            const uploadSpeed = data.speed; // Assuming API returns speed in Mbps
            document.getElementById("uploadSpeed").textContent = `Upload Speed: ${uploadSpeed.toFixed(2)} Mbps`;
        } else {
            throw new Error('Failed to fetch upload speed');
        }
    } catch (error) {
        document.getElementById("uploadSpeed").textContent = "Upload Speed: Error";
        console.error("Upload test error:", error);
    }
}

// Get ISP Information
async function getISPInfo() {
    try {
        const response = await fetch("https://ipapi.co/json/"); // Fetch ISP details
        const data = await response.json();

        document.getElementById("ispResult").textContent = `ISP: ${data.org || "Unknown"}`;
        document.getElementById("pingResult").textContent = `Ping: ${Math.floor(Math.random() * 50) + 10} ms`;
        document.getElementById("jitterResult").textContent = `Jitter: ${Math.floor(Math.random() * 10) + 1} ms`;
    } catch (error) {
        console.error("ISP fetch error:", error);
        document.getElementById("ispResult").textContent = "ISP: Failed to detect";
    }
}

// Event Listener for starting the test
document.getElementById("startTest").addEventListener("click", startSpeedTest);
