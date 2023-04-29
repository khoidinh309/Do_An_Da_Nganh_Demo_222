function compare2Date(mysqlDateTime, date2) {
    const d1 = new Date(mysqlDateTime.replace(' ', 'T') + 'Z');
    const d2 = new Date(Date.parse(date2));
    return d1 < d2;
}

module.exports = compare2Date;
