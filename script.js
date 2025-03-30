document.getElementById('startTest').addEventListener('click', () => {
    startSpeedTest();
});

async function startSpeedTest() {
    const downloadSpeed = await testDownloadSpeed();
    const uploadSpeed = await testUploadSpeed();
    const pingResults = await testPing();

    document.getElementById('downloadSpeed').innerText = downloadSpeed.toFixed(2);
    document.getElementById('uploadSpeed').innerText = uploadSpeed.toFixed(2);
    document.getElementById('pingResult').innerText = pingResults.ping.toFixed(2);
    document.getElementById('jitterResult').innerText = pingResults.jitter.toFixed(2);
    
    updateNeedle(downloadSpeed);
    getISPInfo();
}

function updateNeedle(speed) {
    const needle = document.querySelector('.needle');
    const angle = Math.min(speed * 3, 180) - 90;
    needle.style.transform = `rotate(${angle}deg)`;
    document.querySelector('.speed-text').innerText = `${speed.toFixed(2)} Mbps`;
}

async function testDownloadSpeed() {
    const fileSize = 1024 * 1024 * 10; // 10MB test file
    const url = `https://speed.hetzner.de/10MB.bin?random=${Math.random()}`;
    const startTime = performance.now();
    
    await fetch(url, { cache: 'no-store' });

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    return (fileSize * 8) / (duration * 1024 * 1024); // Mbps
}

async function testUploadSpeed() {
    const data = new Uint8Array(1024 * 1024).fill(0); // 1MB fake file
    const startTime = performance.now();

    await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: data,
    });

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    return (1 * 8) / duration; // Mbps
}

async function testPing() {
    let pings = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await fetch('https://www.google.com/', { mode: 'no-cors' });
        const end = performance.now();
        pings.push(end - start);
    }
    return {
        ping: Math.min(...pings),
        jitter: Math.max(...pings) - Math.min(...pings)
    };
}

function getISPInfo() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ispResult').innerText = data.org || "Unknown";
        })
        .catch(() => {
            document.getElementById('ispResult').innerText = "Error fetching ISP info";
        });
}
