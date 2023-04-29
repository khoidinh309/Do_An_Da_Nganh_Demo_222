const axios = require('axios');

const getDataFromFeed = function (feedUrl, headers) {
    axios
        .get(feedUrl, { headers })
        .then((response) => {
            // Extract the new values from the response data
            const newValues = response.data;

            if (newValues.length > 0) {
                return newValues.data;
            } else {
                return [];
            }
        })
        .catch((error) => {
            console.error('Error fetching data from Adafruit IO:', error);
        });
};

module.exports = getDataFromFeed;
