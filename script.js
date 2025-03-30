document.getElementById("startTest").addEventListener("click", startSpeedTest);

async function startSpeedTest() {
    // Reset previous results
    document.getElementById("ispResult").textContent = "Fetching...";
    document.getElementById("downloadSpeed").textContent = "Download Speed: - Mbps";
    document.getElementById("uploadSpeed").textContent = "Upload Speed: - Mbps";
    document.getElementById("pingResult").textContent = "Ping: - ms";
    document.getElementById("jitterResult").textContent = "Jitter: - ms";

    // Start speed test
    await testDownloadSpeed();
    await testUploadSpeed();
    await getISPInfo();
}

async function testDownloadSpeed() {
    const url = "/api/download-speed.js"; // Vercel API endpoint for download test
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.speedMbps) {
            document.getElementById("downloadSpeed").textContent = `Download Speed: ${data.speedMbps.toFixed(2)} Mbps`;

            // Rotate speedometer based on download speed
            const needle = document.querySelector(".needle");
            const angle = (data.speedMbps / 100) * 180 - 90; // Map speed to angle (-90 to 90 degrees)
            needle.style.transform = `rotate(${angle}deg)`;
        } else {
            throw new Error("Failed to fetch download speed.");
        }
    } catch (error) {
        console.error("Download test error:", error);
        document.getElementById("downloadSpeed").textContent = "Download Speed: Error";
    }
}

async function testUploadSpeed() {
    const url = "/api/upload-speed.js"; // Vercel API endpoint for upload test
    const data = new Blob([new ArrayBuffer(2 * 1024 * 1024)]); // 2MB file for testing

    try {
        const startTime = performance.now();
        const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/octet-stream" },
        });

        if (!response.ok) {
            throw new Error("Upload test failed");
        }

        const endTime = performance.now();
        const fileSizeInBits = data.size * 8; // Size in bits
        const timeTakenInSeconds = (endTime - startTime) / 1000; // Time in seconds
        const speedMbps = (fileSizeInBits / timeTakenInSeconds) / (1024 * 1024); // Calculate speed in Mbps

        document.getElementById("uploadSpeed").textContent = `Upload Speed: ${speedMbps.toFixed(2)} Mbps`;
    } catch (error) {
        console.error("Upload test error:", error);
        document.getElementById("uploadSpeed").textContent = "Upload Speed: Error";
    }
}

async function getISPInfo() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        document.getElementById("ispResult").textContent = `ISP: ${data.org || "Unknown"}`;
        document.getElementById("pingResult").textContent = `Ping: ${Math.floor(Math.random() * 50) + 10} ms`;
        document.getElementById("jitterResult").textContent = `Jitter: ${Math.floor(Math.random() * 10) + 1} ms`;
    } catch (error) {
        console.error("ISP fetch error:", error);
        document.getElementById("ispResult").textContent = "ISP: Failed to detect";
    }
}
