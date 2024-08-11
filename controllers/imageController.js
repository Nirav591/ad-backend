const imageToBase64 = require('../utils/base64ToImage');

exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert image to Base64
        const base64Image = await imageToBase64(req.file.buffer);

        // Return the Base64 string or save it to the database
        res.status(200).json({ base64Image });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
