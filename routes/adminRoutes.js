const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const validateAdminData = require('../middlewares/validateAdminData');


router.post('/create',  validateAdminData, adminController.createAdmin);

module.exports = router;
