const convertDateToMySqlDate = require('./convertDate');

const insertDataToTable = async function (connection, dataTable, column, sensorID, data) {
    if (column !== '') {
        const sql = `INSERT INTO ${dataTable} (${column}, timestamp, sensorID) VALUES (?, ?, ?)`;
        const values = [parseFloat(data.value), convertDateToMySqlDate(data.created_at), sensorID];
        await connection.query(sql, values, (error, results, fields) => {
            if (error) {
                return false;
            } else {
                return true;
            }
        });
    } else {
        const sql = `INSERT INTO ${dataTable} (timestamp, sensorID) VALUES (?, ?)`;
        const values = [convertDateToMySqlDate(data.created_at), sensorID];
        await connection.query(sql, values, (error, results, fields) => {
            if (error) {
                return false;
            } else {
                return true;
            }
        });
    }
};

module.exports = insertDataToTable;
