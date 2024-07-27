const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 465,
  port: "unize.co.in",
  secure: true, // use SSL
  auth: {
    user: "nirav@unize.co.in",
    pass: "Nirav@5916310"
  }
});

exports.register = (req, res) => {
  const { email, password, confirmPassword, username } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = { email, password: hashedPassword, username };

    User.create(newUser, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: 'User registered successfully.' });
    });
  });
};

exports.login = (req, res) => {
  const { identifier, password } = req.body;

  User.findByUsernameOrEmail(identifier, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: "Login successful", token });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset your password',
      text: `Click this link to reset your password: ${process.env.BASE_URL}/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json({ message: 'Password reset email sent' });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid or expired token" });

    const email = decoded.email;
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    User.updatePassword(email, hashedPassword, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Password reset successful" });
    });
  });
};
