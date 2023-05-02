const axios = require('axios');
const feedInfo = require('../app/databaseQueries/utils/aoiClient');

const getLatestFeedData = async function (url, headers) {
    const response = await axios.get(url, { headers });
    return response.data.value;
};

const initData = async function () {
    const headers = feedInfo.headers;
    const data = [
        {
            feed: 'led',
            promise: getLatestFeedData(feedInfo.ledUrl + '/last', headers),
        },
        {
            feed: 'fan',
            promise: getLatestFeedData(feedInfo.fanUrl + '/last', headers),
        },
        {
            feed: 'lock',
            promise: getLatestFeedData(feedInfo.lockUrl + '/last', headers),
        },
        {
            feed: 'temp',
            promise: getLatestFeedData(feedInfo.tempUrl + '/last', headers),
        },
        {
            feed: 'humi',
            promise: getLatestFeedData(feedInfo.humiUrl + '/last', headers),
        },
    ];

    // Wait for all the Promises to resolve
    const resolvedData = await Promise.all(data.map((d) => d.promise));

    // Map the resolved data to an array of objects with the feed name and the resolved data
    return resolvedData.map((d, i) => ({ feed: data[i].feed, data: d }));
};

module.exports = initData;
