const convertDateToMySqlDate = function (date) {
    const date1 = new Date(date);

    // Format the date object into a MySQL datetime string
    const mysqlDatetime = date1.toISOString().slice(0, 19).replace('T', ' ');
    return mysqlDatetime;
};

module.exports = convertDateToMySqlDate;
