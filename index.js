// live-website/index.js (Live Website)
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Array to store messages received from the local server
let messages = [];

// Serve the HTML form to send messages to local server
app.get('/', (req, res) => {
    // Generate HTML with messages
    const messageList = messages.map(msg => `<li>${msg}</li>`).join('');
    res.send(`
        <html>
            <head>
                <title>Live Website</title>
            </head>
            <body>
                <h1>Send Message to Local Server</h1>
                <form action="/send" method="POST">
                    <input type="text" name="message" placeholder="Enter your message" required>
                    <button type="submit">Send</button>
                </form>
                <h2>Messages from Local Server:</h2>
                <ul>${messageList}</ul>
            </body>
        </html>
    `);
});

// Endpoint to send a message to the local server
app.post('/send', async (req, res) => {
    const { message } = req.body;
    const localServerUrl = 'https://d9c6-183-82-234-58.ngrok-free.app/receive-message'; // Replace with your ngrok URL

    try {
        const response = await axios.post(localServerUrl, { message });
        res.send(`<h2>${response.data.message}</h2><a href="/">Go Back</a>`);
    } catch (error) {
        res.status(500).send('<h2>Failed to send message to local server</h2><a href="/">Go Back</a>');
    }
});

// Endpoint to receive messages from the local server
app.post('/receive-message', (req, res) => {
    const { message } = req.body;
    console.log(`Received message from local server: ${message}`);
    
    // Store the received message in the array
    messages.push(message);

    // Respond to the local server
    res.json({ status: 'success', message: `Received: ${message}` });
});

// Start the live website
app.listen(PORT, () => {
    console.log(`Live website running on port ${PORT}`);
});
