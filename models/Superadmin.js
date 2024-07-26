const db = require('../config/db');

const Superadmin = {
  create: (superadmin, callback) => {
    const sql = 'INSERT INTO superadmins SET ?';
    db.query(sql, superadmin, callback);
  },
  update: (id, updatedData, callback) => {
    const sql = 'UPDATE superadmins SET ? WHERE id = ?';
    db.query(sql, [updatedData, id], callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM superadmins';
    db.query(sql, callback);
  },
  // Add more model methods as needed
};

module.exports = Superadmin;
