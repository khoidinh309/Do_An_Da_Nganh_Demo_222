const express = require('express');
const morgan = require('morgan');
const moment = require('moment-timezone');
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
    let manageDeviceStatus = { led: parseInt(initFeedData[0].data), fan: parseInt(initFeedData[1].data) };
    let turnOnTime = '18:00';
    let turnOfTime = '6:00';

    let timeInterval = setInterval(checkStartAlarm, 60000); // Check every minute
    console.log(manageDeviceStatus);

    function checkStartAlarm() {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const [alarmOnHours, alarmOnMinutes] = turnOnTime.split(':');
        const [alarmOffHours, alarmOffMinutes] = turnOfTime.split(':');

        console.log(currentHours, currentMinutes);

        if (currentHours === Number(alarmOnHours) && currentMinutes === Number(alarmOnMinutes)) {
            adaClient.publish(`${AIO_USERNAME}/feeds/led`, '1');
        }

        if (currentHours === Number(alarmOffHours) && currentMinutes === Number(alarmOffMinutes)) {
            adaClient.publish(`${AIO_USERNAME}/feeds/led`, '0');
        }
    }

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

    ws.on('set-turn-on-time', (data) => {
        turnOnTime = data;
        clearInterval(timeInterval);
        timeInterval = setInterval(checkStartAlarm, 60000);
    });

    ws.on('set-turn-off-time', (data) => {
        turnOfTime = data;
        clearInterval(timeInterval);
        timeInterval = setInterval(checkStartAlarm, 60000);
    });

    ws.on('turn-off-time-interval', (data) => {
        clearInterval(timeInterval);
    });

    adaClient.on('message', function (topic, message) {
        console.log(`MQTT message received: ${message.toString()}`);

        // Parse the message and determine which feed it belongs to
        const data = JSON.parse(message.toString());
        console.log(data);
        let feed;
        if (topic.endsWith('led/json')) {
            feed = 'led';
            manageDeviceStatus.led = data.data.value;
        } else if (topic.endsWith('fan/json')) {
            feed = 'fan';
            manageDeviceStatus.fan = data.data.value;
        } else if (topic.endsWith('lock/json')) {
            feed = 'lock';
        } else if (topic.endsWith('temp/json')) {
            feed = 'temp';
            if (parseFloat(data.data.value) > 28) {
                if (manageDeviceStatus.fan !== 100) {
                    adaClient.publish(`${AIO_USERNAME}/feeds/fan`, '100');
                }
            } else if (parseFloat(data.data.value) > 25) {
                if (manageDeviceStatus.fan < 50) {
                    adaClient.publish(`${AIO_USERNAME}/feeds/fan`, '50');
                }
            } else if (parseFloat(data.data.value) < 18) {
                if (manageDeviceStatus.fan > 0) {
                    adaClient.publish(`${AIO_USERNAME}/feeds/fan`, '0');
                }
            }
        } else if (topic.endsWith('humi/json')) {
            feed = 'humi';
            if (parseFloat(data.data.value) < 40) {
                if (manageDeviceStatus.fan !== 50) {
                    adaClient.publish(`${AIO_USERNAME}/feeds/fan`, '100');
                }
            } else if (parseFloat(data.data.value) > 60) {
                if (manageDeviceStatus.fan > 0) {
                    adaClient.publish(`${AIO_USERNAME}/feeds/fan`, '0');
                }
            }
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
