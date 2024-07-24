const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);

module.exports = router;
