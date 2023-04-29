const connectToDB = require('../../config/db');
const getLatestTimestamp = require('./utils/getLastestTime');
const feedInfo = require('./utils/aoiClient');
const getDataFromFeed = require('./utils/getDataFromFeed');
const compare2Date = require('./utils/compare2Date');
const insertDataToTable = require('./utils/insertDataToTable');

const updateAllTempData = async function () {
    const connection = connectToDB();

    try {
        const latestTime = getLatestTimestamp(connection, 'tempdata');
        const data = getDataFromFeed(feedInfo.tempUrl, feedInfo.headers);

        for (let i = 0; i < data.length; i++) {
            if (compare2Date(latestTime, data[i].created_at)) {
                await insertDataToTable(connection, 'tempdata', 'temperature', 1, data[i]);
            } else {
                break;
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        connection.end();
    }
};

const updateAllHumiData = async function () {
    const connection = connectToDB();

    try {
        const latestTime = getLatestTimestamp(connection, 'humidata');
        const data = getDataFromFeed(feedInfo.tempUrl, feedInfo.headers);

        for (let i = 0; i < data.length; i++) {
            if (compare2Date(latestTime, data[i].created_at)) {
                await insertDataToTable(connection, 'humidata', 'humidity', 2, data[i]);
            } else {
                break;
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        connection.end();
    }
};

const updateAllDetectData = async function () {
    const connection = connectToDB();

    try {
        const latestTime = getLatestTimestamp(connection, 'humidata');
        const data = getDataFromFeed(feedInfo.alarmUrl, feedInfo.headers);

        for (let i = 0; i < data.length; i++) {
            if (compare2Date(latestTime, data[i].created_at)) {
                await insertDataToTable(connection, 'humidata', '', 3, data[i]);
            } else {
                break;
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        connection.end();
    }
};

module.exports = { updateAllTempData, updateAllHumiData, updateAllDetectData };
