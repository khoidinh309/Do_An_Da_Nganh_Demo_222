const mqtt = require('mqtt');
const fetch = require('node-fetch');

const username = 'ThangPham782';
const feedKey = 'led';
const apiKey = 'aio_Caoq909jTjFmAkCGzKqnY584zn6D';
const ledUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/led/data`;
const headers = { 'X-AIO-Key': apiKey };

const client = mqtt.connect('mqtt://io.adafruit.com', {
    username: 'ThangPham782',
    password: apiKey,
});

client.subscribe(`ThangPham782/f/led/json`);

class TestController {
    index(req, res, next) {
        fetch(ledUrl, { headers })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // Process the data here
            })
            .catch((err) => console.error(err));

        client.on('message', (topic, message) => {
            console.log(`Received message: ${message.toString()} on topic: ${topic}`);

            // Extract the new data from the message payload
            const data = JSON.parse(message.toString());
            console.log(data.key);
            const value = data.value;
            const createdAt = data.created_at;

            // Determine which feed the message was received on
            const feedName = topic.split('/');
        });
        res.send('success');
    }
}

module.exports = new TestController();
