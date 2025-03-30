// api/upload-speed.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const startTime = Date.now();
        const fileSize = req.headers['content-length']; // Get the file size

        // Simulate the upload by waiting for the file to be received
        req.on('data', chunk => {
            // You can choose to process the data if you need to
        });

        req.on('end', () => {
            const endTime = Date.now();
            const timeTakenInSeconds = (endTime - startTime) / 1000;
            const fileSizeInBits = fileSize * 8;
            const speedMbps = (fileSizeInBits / timeTakenInSeconds) / (1024 * 1024);

            // Respond with the calculated upload speed
            res.status(200).json({ speedMbps });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
