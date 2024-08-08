const express = require('express');
const { addAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/admin/add', addAdmin);

module.exports = router;
