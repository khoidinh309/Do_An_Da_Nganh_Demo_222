const axios = require('axios');

const getDataFromFeed = async function (feedUrl, headers) {
    try {
        const response = await axios.get(feedUrl, { headers });
        const newValues = response.data;
        if (newValues.length > 0) {
            return newValues;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(`Error fetching data from Adafruit IO: ${error}`);
    }
};

module.exports = getDataFromFeed;
