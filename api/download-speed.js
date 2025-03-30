// api/download-speed.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const url = 'https://download.thinkbroadband.com/10MB.zip'; // Test file URL

        try {
            const startTime = performance.now();
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Download test failed');
            }

            const buffer = await response.buffer();
            const endTime = performance.now();

            const fileSizeInBits = buffer.length * 8; // Get file size in bits
            const timeTakenInSeconds = (endTime - startTime) / 1000; // Convert to seconds
            const speedMbps = (fileSizeInBits / timeTakenInSeconds) / (1024 * 1024); // Calculate speed in Mbps

            res.status(200).json({ speedMbps });
        } catch (error) {
            res.status(500).json({ error: 'Download test failed' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
