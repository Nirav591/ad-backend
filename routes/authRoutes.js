const express = require('express');
const { signup, signin, forgotPasswordRequest, resetPassword, getUser, updateUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);
router.get('/:id', getUser);
router.get('/:id/update-role', updateUser);

module.exports = router;
