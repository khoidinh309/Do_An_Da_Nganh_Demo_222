const { response } = require('express');
const request = require('request');

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

const fetchTempOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/temp/data/`,
    headers: {
        'X-AIO-Key': 'aio_Caoq909jTjFmAkCGzKqnY584zn6D',
        'Content-Type': 'application/json',
    },
};

const fetchHumiOption = {
    url: `https://io.adafruit.com/api/v2/ThangPham782/feeds/humi/data/`,
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

class SiteController {
    index(req, res, next) {
        const statusData = {
            led: '',
            fan: '',
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

        // Make third request for fan data
        const tempPromise = new Promise((resolve, reject) => {
            request(fetchTempOption, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const data = JSON.parse(body);
                    statusData.temp = data;

                    resolve();
                }
            });
        });

        // Make forth request for fan data
        const humiPromise = new Promise((resolve, reject) => {
            request(fetchHumiOption, (error, response, body) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const data = JSON.parse(body);
                    statusData.humi = data;

                    resolve();
                }
            });
        });

        // Wait for both promises to complete before sending response
        Promise.all([ledPromise, fanPromise, tempPromise, humiPromise])
            .then(() => {
                console.log(statusData);
                res.render('home', {
                    data: statusData,
                    jsonData: JSON.stringify(statusData),
                });
            })
            .catch((error) => {
                res.status(500).send('Internal server error');
            });
    }

    toggle(req, res, next) {
        const data = { value: req.params.status };
        deviceType = req.params.device;
        if (deviceType == 'led') {
            request.post(
                {
                    url: PostLedOption.url,
                    headers: PostLedOption.headers,
                    json: data,
                },
                (error, response, body) => {
                    if (error) {
                        console.error(error);
                    } else {
                        res.redirect('back');
                    }
                },
            );
        } else {
            request.post(
                {
                    url: PostFanOption.url,
                    headers: PostFanOption.headers,
                    json: data,
                },
                (error, response, body) => {
                    if (error) {
                        console.error(error);
                    } else {
                        res.redirect('back');
                    }
                },
            );
        }
    }
}

module.exports = new SiteController();
