const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',
  password: 't7x?}>rbmCa~we+',
  database: 'myapp',
  connectionLimit: 10 // Adjust as needed
});

const promisePool = pool.promise();

module.exports = promisePool;
