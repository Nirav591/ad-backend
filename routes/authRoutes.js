const express = require('express');
const { signup, signin, forgotPasswordRequest, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);

module.exports = router;
