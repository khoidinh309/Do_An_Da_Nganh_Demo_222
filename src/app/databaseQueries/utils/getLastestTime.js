const getLatestTimestamp = function (connection, dataTable) {
    const sql = `SELECT MAX(timestamp) AS maxTimestamp FROM ${dataTable}`;
    connection.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error fetching max timestamp from database:', error);
        } else {
            const maxTimestamp = results.length !== 0 ? results[0].maxTimestamp : '2023-01-01 00:00:00';
            return maxTimestamp;
        }
    });
};

module.exports = getLatestTimestamp;
