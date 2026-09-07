// backend/config/db.js
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        console.error('Please check your .env configuration');
        process.exit(1);
    } else {
        console.log('MySQL connected successfully!');
        console.log(`Database: ${process.env.DB_NAME}`);
        connection.release();
    }
});

const db = pool.promise();
module.exports = db;