// const mqtt = require('mqtt');
// const fetch = require('node-fetch');

// const username = 'ThangPham782';
// const feedKey = 'led';
// const apiKey = 'aio_Caoq909jTjFmAkCGzKqnY584zn6D';
// const ledUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/led/data`;
// const headers = { 'X-AIO-Key': apiKey };

// const client = mqtt.connect('mqtt://io.adafruit.com', {
//     username: 'ThangPham782',
//     password: apiKey,
// });

client.subscribe(`ThangPham782/f/led/json`);

const http = require('http');
const WebSocket = require('ws');
const mqtt = require('mqtt');

// Set up Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Set up MQTT client to connect to Adafruit server
const AIO_USERNAME = 'YOUR_AIO_USERNAME';
const AIO_KEY = 'YOUR_AIO_KEY';
const client = mqtt.connect(`mqtt://io.adafruit.com`, {
    username: AIO_USERNAME,
    password: AIO_KEY,
});

// Subscribe to the LED and Fan feeds
client.on('connect', function () {
    client.subscribe(`${AIO_USERNAME}/feeds/led`);
    client.subscribe(`${AIO_USERNAME}/feeds/fan`);
});

// WebSocket connection listener
wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    // When a WebSocket client sends a message to change the LED or Fan state
    ws.on('message', function incoming(message) {
        console.log(`WebSocket received message: ${message}`);
        const data = JSON.parse(message);

        // Publish the message to the corresponding feed on Adafruit server
        if (data.feed === 'led') {
            client.publish(`${AIO_USERNAME}/feeds/led`, data.value.toString());
        } else if (data.feed === 'fan') {
            client.publish(`${AIO_USERNAME}/feeds/fan`, data.value.toString());
        }
    });

    // When a WebSocket client disconnects
    ws.on('close', function close() {
        console.log('WebSocket client disconnected');
    });
});

// MQTT message listener
client.on('message', function (topic, message) {
    console.log(`MQTT message received: ${message.toString()}`);

    // Parse the message and determine which feed it belongs to
    const data = JSON.parse(message.toString());
    let feed;
    if (topic.endsWith('led')) {
        feed = 'led';
    } else if (topic.endsWith('fan')) {
        feed = 'fan';
    }

    // Send the data to all connected WebSocket clients
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ feed: feed, value: data.value }));
        }
    });
});

module.exports = new TestController();
