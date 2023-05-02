const getLatestTimestamp = async function (connection, dataTable) {
    try {
        const [rows, fields] = await connection.execute(`SELECT MAX(timestamp) AS maxTimestamp FROM ${dataTable}`);
        const maxTimestamp =
            rows[0].maxTimestamp !== null ? new Date(rows[0].maxTimestamp) : new Date('2023-01-01T00:00:00Z');
        const isoString = maxTimestamp.toISOString();
        const datetimeString = isoString.replace('T', ' ').slice(0, -5);
        return datetimeString;
    } catch (error) {
        console.error('Error fetching max timestamp from database:', error);
        throw error;
    }
};

module.exports = getLatestTimestamp;
