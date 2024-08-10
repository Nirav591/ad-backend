const fs = require('fs');
const path = require('path');

const Common = {
    uploadSameTypeInServer: async (request, ImageLocation = '', base64 = '', imageName = '') => {
        try {
            // Convert base64 string to buffer
            const buf = Buffer.from(base64, 'base64');
            
            // Create the upload directory path
            const UploadActName = 'account' + request.SuperUserId;
            const uploadDirectory = path.join(__dirname, '..', 'uploads', UploadActName, ImageLocation);

            // Ensure the directory exists
            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory, { recursive: true });
            }

            // Set the image path
            const ImagePath = path.join(uploadDirectory, imageName);

            // Write the file to the server
            return new Promise((resolve, reject) => {
                fs.writeFile(ImagePath, buf, (err) => {
                    if (err) {
                        console.log('File write error:', err);
                        return resolve('');
                    } else {
                        return resolve(imageName);
                    }
                });
            });
        } catch (error) {
            console.error('Error in uploadSameTypeInServer:', error);
            return '';
        }
    }
};

module.exports = Common;
