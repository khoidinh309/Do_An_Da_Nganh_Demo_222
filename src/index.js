const path = require('path');
const express = require('express');
const morgan = require('morgan');
const http = require('http');
const WebSocket = require('ws');
var methodOverride = require('method-override');
const route = require('./routes');
const feedInfo = require('./app/databaseQueries/utils/aoiClient');
const updateDataFunction = require('./app/databaseQueries/updateAllData');
const updateIncomingData = require('./app/databaseQueries/updateData');

const app = express();
const port = 8000;
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));
app.use(methodOverride('_method'));

// set up connection to adafruit server

const adaClient = feedInfo.client;
const AIO_USERNAME = feedInfo.username;
const feedPaths = [feedInfo.lockUrl, feedInfo.fanUrl, feedInfo.humiUrl, feedInfo.tempUrl, feedInfo.ledUrl];

adaClient.on('connect', function () {
    adaClient.subscribe(`${AIO_USERNAME}/f/led/json`);
    adaClient.subscribe(`${AIO_USERNAME}/f/fan/json`);
    adaClient.subscribe(`${AIO_USERNAME}/f/lock/json`);
    adaClient.subscribe(`${AIO_USERNAME}/f/alarm/json`);
    adaClient.subscribe(`${AIO_USERNAME}/f/temp/json`);
    adaClient.subscribe(`${AIO_USERNAME}/f/humi/json`);
});

// WebSocket connection listener
wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    feedPaths.forEach((path) => {
        adaClient.get(path, (err, message) => {
            if (!err) {
                const data = JSON.parse(message);
                ws.send(
                    JSON.stringify({
                        topic: path,
                        value: data.value,
                        timestamp: data.created_at,
                    }),
                );
            }
        });
    });

    // When a WebSocket client sends a message to change the LED or Fan state
    ws.on('message', function incoming(message) {
        console.log(`WebSocket received message: ${message}`);
        const data = JSON.parse(message);

        // Publish the message to the corresponding feed on Adafruit server
        if (data.feed === 'led') {
            adaClient.publish(`${AIO_USERNAME}/feeds/led`, data.value.toString());
        } else if (data.feed === 'fan') {
            adaClient.publish(`${AIO_USERNAME}/feeds/fan`, data.value.toString());
        }
    });

    updateDataFunction.updateAllHumiData();
    updateDataFunction.updateAllTempData();
    updateDataFunction.updateAllDetectData();

    // When a WebSocket client disconnects
    ws.on('close', function close() {
        console.log('WebSocket client disconnected');
    });
});

client.on('message', function (topic, message) {
    console.log(`MQTT message received: ${message.toString()}`);

    // Parse the message and determine which feed it belongs to
    const data = JSON.parse(message.toString());
    let feed;
    if (topic.endsWith('led')) {
        feed = 'led';
    } else if (topic.endsWith('fan')) {
        feed = 'fan';
    } else if (topic.endsWith('lock')) {
        feed = 'lock';
    } else if (topic.endsWith('temp')) {
        feed = 'temp';
    } else if (topic.endsWith('humi')) {
        feed = 'humi';
    } else if (topic.endsWith('alarm')) {
        feed = 'alarm';
    }

    // Send the data to all connected WebSocket clients
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ feed: feed, value: data.value }));
        }
    });

    updateIncomingData(topic, message);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
