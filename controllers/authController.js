const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');

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

      // Send verification email
      const token = jwt.sign({ email }, "your_jwt_secret", { expiresIn: '1h' });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "unizeinventiv@gmail.com",
          pass: "Unize@5916310"
        }
      });

      const mailOptions = {
        from: "unizeinventiv@gmail.com",
        to: email,
        subject: 'Verify your email',
        text: `Click this link to verify your email: https://advocate.unize.co.in/verify-email?token=${token}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ message: 'User registered. Verification email sent.' });
      });
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

    const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: '24h' });

    res.status(200).json({ message: "Login successful", token });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ email }, "your_jwt_secret", { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "unizeinventiv@gmail.com",
        pass: "Unize@5916310"
      }
    });

    const mailOptions = {
      from: "unizeinventiv@gmail.com",
      to: email,
      subject: 'Reset your password',
      text: `Click this link to reset your password: https://advocate.unize.co.in/reset-password?token=${token}`
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

  jwt.verify(token, "your_jwt_secret", (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid or expired token" });

    const email = decoded.email;
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    User.updatePassword(email, hashedPassword, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Password reset successful" });
    });
  });
};
