const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp',
  connectionLimit: 10, // Adjust the connection limit as needed
});

// Promisify the pool for async/await usage
const promisePool = pool.promise();

module.exports = promisePool;
