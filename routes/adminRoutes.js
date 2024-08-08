const express = require('express');
const { addAdmin } = require('../controllers/adminController');
const upload = require('../config/multerConfig');


const router = express.Router();

router.post('/admin/add', upload.single('user_image'), addAdmin);

module.exports = router;
