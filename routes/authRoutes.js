const express = require('express');
const {
  register,
  login,
  forgotPassword,
  validateRegister,
  validateLogin,
} = require('../controllers/authController');
const { getUser, getUsers } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/user/:id', getUser);
router.get('/users', getUsers);

module.exports = router;
