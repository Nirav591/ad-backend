const express = require('express');
const { addAdmin } = require('../controllers/adminController');

const router = express.Router();

router.post('/admin/add', upload.single('user_image'), addAdmin);

module.exports = router;
