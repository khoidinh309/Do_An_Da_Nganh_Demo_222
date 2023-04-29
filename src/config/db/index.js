const mysql = require('mysql2/promise');

async function connectToDB() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'khoikhoi',
            database: 'smartHome',
        });
        console.log('Connected to MySQL database!');
        return connection;
    } catch (error) {
        console.error('Error connecting to database: ', error);
    }
}

module.exports = connectToDB;
