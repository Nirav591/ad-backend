const jwt = require('jsonwebtoken');
const { secret } = require('../config/jwt');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { email, username, password, confirmPassword, type } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    await User.create({ email, username, password, type });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await User.findByEmail(email);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, type: user.type }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Reset and Forgot password functionalities would be implemented here

module.exports = {
  register,
  login,
  // resetPassword,
  // forgotPassword,
};
