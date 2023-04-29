const mqtt = require('mqtt');
const fetch = require('node-fetch');

const username = 'ThangPham782';
const feedKey = 'led';
const apiKey = 'aio_Caoq909jTjFmAkCGzKqnY584zn6D';
const ledUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/led/data`;
const fanUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/fan/data`;
const lockUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/lock/data`;
const alarmUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/alarm/data`;
const humiUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/humi/data`;
const tempUrl = `https://io.adafruit.com/api/v2/ThangPham782/feeds/temp/data`;

const headers = { 'X-AIO-Key': apiKey };

const client = mqtt.connect('mqtt://io.adafruit.com', {
    username: 'ThangPham782',
    password: apiKey,
});

module.exports = { username, headers, ledUrl, fanUrl, lockUrl, alarmUrl, humiUrl, tempUrl, client };
