const connectToDB = require('../../config/db');
const getLatestTimestamp = require('./utils/getLastestTime');
const feedInfo = require('./utils/aoiClient');
const getDataFromFeed = require('./utils/getDataFromFeed');
const compare2Date = require('./utils/compare2Date');
const insertDataToTable = require('./utils/insertDataToTable');

const updateAllData = async function () {
    const feedInfoObject = [
        {
            tableName: 'tempdata',
            url: feedInfo.tempUrl,
            sensorID: 1,
            column: 'temperature',
        },
        {
            tableName: 'humidata',
            url: feedInfo.humiUrl,
            sensorID: 2,
            column: 'humidity',
        },
        {
            tableName: 'detectiondata',
            url: feedInfo.alarmUrl,
            sensorID: 3,
            column: '',
        },
    ];
    const connection = await connectToDB();

    for (const element of feedInfoObject) {
        try {
            const latestTime = await getLatestTimestamp(connection, element.tableName);
            const data = await getDataFromFeed(element.url, feedInfo.headers);

            for (let i = 0; i < data.length; i++) {
                if (compare2Date(latestTime, data[i].created_at)) {
                    await insertDataToTable(connection, element.tableName, element.column, element.sensorID, data[i]);
                } else {
                    break;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    connection.end();
};

module.exports = updateAllData;
