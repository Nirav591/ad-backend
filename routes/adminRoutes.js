const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const validateAdminData = require('../middlewares/validateAdminData');
const uploadImage = require('../middlewares/uploadImage');

router.post('/create', uploadImage, validateAdminData, adminController.createAdmin);

module.exports = router;
