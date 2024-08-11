const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Define the upload path
        const uploadPath = path.join(__dirname, '../upload');
        
        // Ensure the upload directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Generate a unique filename with PNG extension
        const filename = `${Date.now()}.png`;

        // Save the image as a PNG file
        await sharp(req.file.buffer)
            .png()
            .toFile(path.join(uploadPath, filename));

        // Return the file path or any other response
        res.status(200).json({ message: 'Image uploaded successfully', filename });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
