const connection = require('../config/db');

const User = {
  create: (user, callback) => {
    connection.query('INSERT INTO users SET ?', user, callback);
  },
  findByEmail: (email, callback) => {
    connection.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },
  findByUsernameOrEmail: (identifier, callback) => {
    connection.query('SELECT * FROM users WHERE email = ? OR username = ?', [identifier, identifier], callback);
  },
  updatePassword: (email, newPassword, callback) => {
    connection.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], callback);
  }
};

module.exports = User;
