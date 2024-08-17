const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/imageUploadMiddleware');

// Route to add a new admin
router.post('/add', upload.single('user_image'), adminController.addAdmin);

// Route to get admin details by ID
router.get('/:id', adminController.getAdminById);

// Route to get all admins
router.get('/', adminController.getAllAdmins);

router.put('/:id', upload.single('user_image'), adminController.updateAdmin);

module.exports = router;
