const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail, getUserByUsername } = require('../models/userModel');
const transporter = require('../config/nodemailer');

// Middleware for validation
const validateRegister = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  check('type').isIn(['user', 'admin']).withMessage('Invalid user type'),
];

const validateLogin = [
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateForgotPassword = [check('email').isEmail().withMessage('Invalid email format')];

const register = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username, password, type } = req.body;

  try {
    const [existingUserByEmail, existingUserByUsername] = await Promise.all([
      getUserByEmail(email),
      getUserByUsername(username),
    ]);

    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Create user and hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(email, username, hashedPassword, type);

    // Generate JWT token
    const token = jwt.sign({ userId }, 'NiravLathiya', { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', userId, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, 'NiravLathiya', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ userId: user.id }, 'NiravLathiya', { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
    });

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  register,
  login,
  forgotPassword,
};
