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

const getUserByUsername = async (username) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

// Fetch user by ID
const getUserById = async (userId) => {
  const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  return user[0];
};

// Fetch all users
const getAllUsers = async () => {
  const [users] = await db.query('SELECT * FROM users');
  return users;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getAllUsers,
};
