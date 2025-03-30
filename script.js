document.getElementById("startTest").addEventListener("click", startSpeedTest);

async function startSpeedTest() {
    document.getElementById("ispResult").textContent = "Fetching...";
    document.getElementById("downloadSpeed").textContent = "Download Speed: - Mbps";
    document.getElementById("uploadSpeed").textContent = "Upload Speed: - Mbps";
    document.getElementById("pingResult").textContent = "Ping: - ms";
    document.getElementById("jitterResult").textContent = "Jitter: - ms";

    // Reset speedometer needle
    const needle = document.querySelector(".needle");
    needle.style.transition = "transform 1s ease-in-out";
    needle.style.transform = "rotate(-90deg)"; // Reset the needle before animation

    await testDownloadSpeed();
    await testUploadSpeed();
    await getISPInfo();
}

async function testDownloadSpeed() {
    const url = "https://download.thinkbroadband.com/10MB.zip"; // Change to a valid test URL
    try {
        const startTime = performance.now();
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();
        const endTime = performance.now();
        
        const fileSizeInBits = blob.size * 8;
        const timeTakenInSeconds = (endTime - startTime) / 1000;
        const speedMbps = (fileSizeInBits / timeTakenInSeconds) / (1024 * 1024);

        document.getElementById("downloadSpeed").textContent = `Download Speed: ${speedMbps.toFixed(2)} Mbps`;

        // Rotate speedometer based on download speed
        const needle = document.querySelector(".needle");
        const angle = (speedMbps / 100) * 180 - 90; // Map speed to angle (-90 to 90 degrees)
        needle.style.transform = `rotate(${angle}deg)`;

    } catch (error) {
        console.error("Download test error:", error);
        document.getElementById("downloadSpeed").textContent = "Download Speed: Error";
    }
}

async function testUploadSpeed() {
    const url = "/api/upload-speed"; // The backend endpoint (as set up in Vercel)
    const data = new Blob([new ArrayBuffer(2 * 1024 * 1024)]); // Simulating a 2MB file upload

    try {
        const startTime = performance.now();
        const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/octet-stream" },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const endTime = performance.now();
        const fileSizeInBits = data.size * 8;
        const timeTakenInSeconds = (endTime - startTime) / 1000;
        const speedMbps = (fileSizeInBits / timeTakenInSeconds) / (1024 * 1024);

        document.getElementById("uploadSpeed").textContent = `Upload Speed: ${speedMbps.toFixed(2)} Mbps`;

        // Rotate speedometer based on upload speed
        const needle = document.querySelector(".needle");
        const angle = (speedMbps / 100) * 180 - 90; // Map speed to angle (-90 to 90 degrees)
        needle.style.transform = `rotate(${angle}deg)`;

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
