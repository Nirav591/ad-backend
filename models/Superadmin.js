const db = require('../config/db');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM superadmins WHERE email = ?';
    db.query(sql, [email], callback);
  },
  findByResetToken: (resetToken, callback) => {
    const sql = 'SELECT * FROM superadmins WHERE reset_token = ? AND reset_token_expires > NOW()';
    db.query(sql, [resetToken], callback);
  },
  updateResetToken: (email, resetToken, expiresIn, callback) => {
    const sql = 'UPDATE superadmins SET reset_token = ?, reset_token_expires = ? WHERE email = ?';
    db.query(sql, [resetToken, expiresIn, email], callback);
  },
  updatePassword: (id, password, callback) => {
    const sql = 'UPDATE superadmins SET password = ? WHERE id = ?';
    db.query(sql, [password, id], callback);
  }
};

module.exports = Superadmin;
