const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (email, username, password, type) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.execute(
    'INSERT INTO users (email, username, password, type) VALUES (?, ?, ?, ?)',
    [email, username, hashedPassword, type]
  );
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

module.exports = {
  createUser,
  getUserByEmail
};
