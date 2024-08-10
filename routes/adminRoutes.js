const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Route to add admin
router.post('/add', adminController.addAdmin);

module.exports = router;
