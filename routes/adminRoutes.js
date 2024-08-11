const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/imageUploadMiddleware');

router.post('/add', upload.single('user_image'), adminController.addAdmin);
router.get('/:id', adminController.getAdminById);


module.exports = router;
