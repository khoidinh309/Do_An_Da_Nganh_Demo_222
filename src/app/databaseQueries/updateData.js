const connectToDB = require('../../config/db');
const convertDateToMySqlDate = require('./utils/convertDate');

const updateIncomingData = async function (topic, message) {
    const data = JSON.parse(message.toString());

    if (data.key == 'temp') {
        const connection = connectToDB();
        const query = 'insert into tempdata(temperature, timestamp, sensorID) values(?, ?, ?)';
        const values = [parseFloat(data.value), convertDateToMySqlDate(data.created_at), 1];
        try {
            const [rows, fields] = await connection.execute(query, values);
        } catch (e) {
            console.log(e);
        } finally {
            connection.end();
        }
    }
    if (data.key == 'humi') {
        const connection = connectToDB();
        const query = 'insert into humidata(humidity, timestamp, sensorID) values(?, ?, ?)';
        const values = [parseFloat(data.value), convertDateToMySqlDate(data.created_at), 2];
        try {
            const [rows, fields] = await connection.execute(query, values);
        } catch (e) {
            console.log(e);
        } finally {
            connection.end();
        }
    }
    if (data.key == 'alarm') {
        const connection = connectToDB();
        const query = 'insert into detectiondata(timestamp, sensorID) values(?, ?)';
        const values = [convertDateToMySqlDate(data.created_at), 3];
        try {
            const [rows, fields] = await connection.execute(query, values);
        } catch (e) {
            console.log(e);
        } finally {
            connection.end();
        }
    }
};

module.exports = updateIncomingData;
