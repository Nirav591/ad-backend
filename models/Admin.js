const db = require('../config/db');

const Admin = {
  create: (adminData, callback) => {
    const query = 'INSERT INTO admins SET ?';
    db.query(query, adminData, callback);
  },
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM admins WHERE admin_email_address = ?';
    db.query(query, [email], callback);
  },
  // Additional model methods if needed
};

module.exports = Admin;
