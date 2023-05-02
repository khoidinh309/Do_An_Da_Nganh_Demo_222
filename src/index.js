const express = require('express');
const morgan = require('morgan');
const feedInfo = require('./app/databaseQueries/utils/aoiClient');
const { Server } = require('socket.io');
const updateAllDataFunction = require('./app/databaseQueries/updateAllData');
const updateIncomingData = require('./app/databaseQueries/updateData');
const cors = require('cors');
const initData = require('./utils/getLastestData');
const fs = require('fs');
const app = express();

// const server = http.createServer(app);

// app.use(cors());

const server = require('https').createServer(
    {
        key: fs.readFileSync('C:/Users/Admin/key.pem', 'utf8'),
        cert: fs.readFileSync('C:/Users/Admin/cert.pem', 'utf8'),
    },
    app,
);

const io = new Server(server, {
    cors: {
        origin: 'https://127.0.0.1:5173/',
        methods: ['GET', 'POST'],
    },
});
// Set up WebSocket server

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
let initFeedData = null;
initData().then((data) => {
    initFeedData = data;
});

io.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.emit('init-data', initFeedData);

    // When a WebSocket client sends a message to change the LED or Fan state
    ws.on('toggle-message', function incoming(message) {
        console.log(message);
        const data = message;

        // Publish the message to the corresponding feed on Adafruit server
        if (data.feed === 'led') {
            adaClient.publish(`${AIO_USERNAME}/feeds/led`, data.value.toString());
        } else if (data.feed === 'fan') {
            adaClient.publish(`${AIO_USERNAME}/feeds/fan`, data.value.toString());
        } else {
            adaClient.publish(`${AIO_USERNAME}/feeds/lock`, data.value.toString());
        }
    });

    adaClient.on('message', function (topic, message) {
        console.log(`MQTT message received: ${message.toString()}`);

        // Parse the message and determine which feed it belongs to
        const data = JSON.parse(message.toString());
        console.log(data);
        let feed;
        if (topic.endsWith('led/json')) {
            feed = 'led';
        } else if (topic.endsWith('fan/json')) {
            feed = 'fan';
        } else if (topic.endsWith('lock/json')) {
            feed = 'lock';
        } else if (topic.endsWith('temp/json')) {
            feed = 'temp';
        } else if (topic.endsWith('humi/json')) {
            feed = 'humi';
        } else if (topic.endsWith('alarm/json')) {
            feed = 'alarm';
        }

        // Send the data to all connected WebSocket clients
        ws.emit('change-data', { feed: feed, value: data.data.value });

        if (['temp', 'humi', 'alarm'].includes(feed)) {
            updateIncomingData(topic, data);
        }
    });

    updateAllDataFunction();
    // When a WebSocket client disconnects
    ws.on('close', function close() {
        console.log('WebSocket client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
