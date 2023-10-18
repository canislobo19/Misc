// server.mjs
import express from 'express';
import fetch from 'node-fetch'; // Make sure you have node-fetch installed as a dependency

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/get-events', async (req, res) => {
    try {
        const eventResponse = await fetch('https://api.smarterai.com/v4/events/1186609099327256', {
            headers: {
                'SAI-Key': '',  // Place API key here
                'accept': 'application/json',
            },
        });

        const eventData = await eventResponse.json();
        const { recordings = [], triggerName, deviceLabel } = eventData;

        const eventsInfo = recordings
            .filter(recording => recording.url.includes('.mp4'))
            .map(recording => ({
                url: recording.url,
                triggerName,
                deviceLabel,
            }));

        res.json(eventsInfo);
    } catch (error) {
        console.error('Error fetching data from SmarterAI:', error);
        res.status(500).send('An error occurred');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
