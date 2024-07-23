const express = require('express');
const { signup, signin, forgotPasswordRequest, resetPassword } = require('../controllers/authController');
const { getAllUsers, editUser } = require('../controllers/userController'); // Import the new controller functions

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/forgot-password', forgotPasswordRequest);
router.post('/reset-password', resetPassword);
router.get('/users', getAllUsers); // Route to get all users
router.put('/users/:userId', editUser); // Route to edit a user by ID

module.exports = router;
