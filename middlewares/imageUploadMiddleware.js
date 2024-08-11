const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Store the image in memory

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2 }, // Limit to 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

module.exports = upload;
