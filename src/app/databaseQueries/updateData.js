const connectToDB = require('../../config/db');
const insertDataToTable = require('./utils/insertDataToTable');

const updateIncomingData = async function (topic, data) {
    const mappingFeed = new Map();

    mappingFeed.set('temp', {
        tableName: 'tempdata',
        column: 'temperature',
        sensorID: 1,
    });

    mappingFeed.set('humi', {
        tableName: 'humidata',
        column: 'humidity',
        sensorID: 2,
    });

    mappingFeed.set('alarm', {
        tableName: 'detectiondata',
        column: '',
        sensorID: 3,
    });

    const feedData = mappingFeed.get(data.key);

    const connection = await connectToDB();

    try {
        await insertDataToTable(connection, feedData.tableName, feedData.column, feedData.sensorID, data.data);
    } catch (e) {
        console.log(e);
    } finally {
        connection.end();
    }
};

module.exports = updateIncomingData;
