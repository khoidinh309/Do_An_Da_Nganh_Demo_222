const { response } = require('express');
const request = require('request');
const updateControl = require('../databaseQueries/updateAllData');
const getData = require('../databaseQueries/getData');

let deviceType = 'led';
//const fanUrl = 'https://io.adafruit.com/api/v2/ThangPham782/feeds/fan/data/last';
const fetchLedOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/led/data/last`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const fetchFanOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/fan/data/last`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const fetchLockOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/lock/data/last`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const PostLedOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/led/data/`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const PostFanOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/fan/data/`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const PostLockOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/lock/data/`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const PostAlarmOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/alarm/data/`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

class SiteController {
    index(req, res, next) {
        updateControl.controlTempUpdate();
        updateControl.controlHumiUpdate();
        updateControl.controlDectionUpdate();
        const statusData = {
            led: '',
            fan: '',
            lock: '',
            temp: [],
            humi: [],
        };
        const ledPromise = new Promise((resolve, reject) => {
            request(fetchLedOption, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const data = JSON.parse(body);
                    statusData.led = data.value;
                    resolve();
                }
            });
        });

        // Make second request for fan data
        const fanPromise = new Promise((resolve, reject) => {
            request(fetchFanOption, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const data = JSON.parse(body);
                    statusData.fan = data.value;

                    resolve();
                }
            });
        });

        const lockPromise = new Promise((resolve, reject) => {
            request(fetchLockOption, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const data = JSON.parse(body);
                    statusData.lock = data.value;

                    resolve();
                }
            });
        });

        // Wait for both promises to complete before sending response
        Promise.all([ledPromise, fanPromise, lockPromise])
            .then(() => {
                console.log(statusData);
                // statusData.temp = getData.getTempData();
                // statusData.humi = getData.getHumiData();
                res.json(statusData);
            })
            .catch((error) => {
                res.status(500).send('Internal server error');
            });
    }

    // toggle(req, res, next) {
    //     const data = { value: req.params.status };
    //     deviceType = req.params.device;
    //     if (deviceType == 'led') {
    //         request.post(
    //             {
    //                 url: PostLedOption.url,
    //                 headers: PostLedOption.headers,
    //                 json: data,
    //             },
    //             (error, response, body) => {
    //                 if (error) {
    //                     console.error(error);
    //                 } else {
    //                     res.redirect('back');
    //                 }
    //             },
    //         );
    //     } else if (deviceType == 'fan') {
    //         request.post(
    //             {
    //                 url: PostFanOption.url,
    //                 headers: PostFanOption.headers,
    //                 json: data,
    //             },
    //             (error, response, body) => {
    //                 if (error) {
    //                     console.error(error);
    //                 } else {
    //                     res.redirect('back');
    //                 }
    //             },
    //         );
    //     } else if (deviceType === 'lock') {
    //         request.post(
    //             {
    //                 url: PostLockOption.url,
    //                 headers: PostLockOption.headers,
    //                 json: data,
    //             },
    //             (error, response, body) => {
    //                 if (error) {
    //                     console.error(error);
    //                 } else {
    //                     res.redirect('back');
    //                 }
    //             },
    //         );
    //     } else {
    //         request.post(
    //             {
    //                 url: PostAlarmOption.url,
    //                 headers: PostAlarmOption.headers,
    //                 json: data,
    //             },
    //             (error, response, body) => {
    //                 if (error) {
    //                     console.error(error);
    //                 } else {
    //                     res.redirect('back');
    //                 }
    //             },
    //         );
    //     }
    // }

    // handleDetection(req, res, next) {
    //     request(fetchDetectOption, (error, response, body) => {
    //         if (error) {
    //             console.log('Error fetching sensor data:', error);
    //             res.status(500).json({ error: 'Internal Server Error' });
    //         } else {
    //             // Parse the JSON response from Adafruit and return it as a JSON object
    //             const data = JSON.parse(body);
    //             res.json(data);
    //         }
    //     });
    // }
}

module.exports = new SiteController();
