const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register user
exports.register = (req, res) => {
  const { email, password, confirmPassword, username } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const sql = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
    db.query(sql, [email, hash, username], (err, result) => {
      if (err) throw err;
      res.status(201).json({ msg: 'User registered' });
    });
  });
};

// Login user
exports.login = (req, res) => {
  const { emailOrUsername, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(sql, [emailOrUsername, emailOrUsername], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    });
  });
};

// Forgot password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const user = result[0];
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      host: 'unize.co.in', // SMTP host from your cPanel settings
      port: 465, // SMTP port for SSL
      secure: true, // True for port 465
      auth: {
        user: 'nirav@unize.co.in', // Your email address
        pass: 'Nirav@5916310' // Your email password
      }
    });

    console.log(user.email , "user.email");

    const mailOptions = {
      from: 'nirav@unize.co.in',
      to: user.email,
      subject: 'Password Reset',
      text: `Please use the following token to reset your password: ${token}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      res.json({ msg: 'Password reset email sent' });
    });
  });
};

// Reset password
exports.resetPassword = (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) throw err;

    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) throw err;

      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(sql, [hash, decoded.id], (err, result) => {
        if (err) throw err;
        res.json({ msg: 'Password updated' });
      });
    });
  });
};
