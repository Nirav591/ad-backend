const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middlewares/imageUploadMiddleware');

router.post('/upload', upload.single('image'), imageController.uploadImage);

module.exports = router;
