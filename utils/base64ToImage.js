const sharp = require('sharp');

const imageToBase64 = async (buffer) => {
    return buffer.toString('base64');
};

module.exports = imageToBase64;
