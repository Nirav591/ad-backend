const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password:  't7x?}>rbmCa~we+',
  database: 'myapp',
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

module.exports = db;
