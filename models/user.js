const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return db.promise().query(
      'INSERT INTO users (email, username, password, type) VALUES (?, ?, ?, ?)',
      [user.email, user.username, hashedPassword, user.type]
    );
  },

  findByEmail: (email) => {
    return db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  },

  findById: (id) => {
    return db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
  },

  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
  },

  // Additional CRUD operations for admin
};

module.exports = User;
