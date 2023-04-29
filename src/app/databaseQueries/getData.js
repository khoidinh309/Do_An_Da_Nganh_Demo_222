const connectToDB = require('../../config/db');

const getTempData = async function () {
    const connection = connectToDB();
    try {
        const sql = 'SELECT * FROM tempdata';
        await connection.query(sql, [], (error, results, fiels) => {
            return results;
        });
    } catch (error) {
        console.log(error);
    } finally {
        connection.end();
    }
};

const getHumiData = async function () {
    const connection = connectToDB();
    try {
        const sql = 'SELECT * FROM humidata';
        await connection.query(sql, [], (error, results, fiels) => {
            return results;
        });
    } catch (error) {
        console.log(error);
    } finally {
        connection.end();
    }
};

const getDetectionData = async function () {
    const connection = connectToDB();

    try {
        const sql = 'SELECT * FROM detectiondata';
        await connection.query(sql, [], (error, results, fiels) => {
            return results;
        });
    } catch (error) {
        console.log(error);
    } finally {
        connection.end();
    }
};

module.exports = { getTempData, getHumiData, getDetectionData };
