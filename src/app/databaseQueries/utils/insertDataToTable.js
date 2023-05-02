const convertDateToMySqlDate = require('./convertDate');

const insertDataToTable = async function (connection, dataTable, column, sensorID, data) {
    try {
        let sql = `INSERT INTO ${dataTable} (timestamp, sensorID) VALUES (?, ?)`;
        let values = [convertDateToMySqlDate(data.created_at), sensorID];
        if (column !== '') {
            sql = `INSERT INTO ${dataTable} (${column}, timestamp, sensorID) VALUES (?, ?, ?)`;
            values.unshift(parseFloat(data.value));
        }
        const [result, fields] = await connection.execute(sql, values);
        return true;
    } catch (error) {
        console.error('Error inserting data to table:', error);
        return false;
    }
};

module.exports = insertDataToTable;
