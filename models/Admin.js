const db = require('../config/db');

const Admin = {
  create: (adminData, callback) => {
    const query = 'INSERT INTO admins SET ?';
    db.query(query, adminData, callback);
  },
  // Additional model methods if needed
};

module.exports = Admin;
