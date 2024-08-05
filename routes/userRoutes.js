const express = require('express');
const { getUsers, updateUser } = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.put('/users/:id', authenticateToken, updateUser);

module.exports = router;
