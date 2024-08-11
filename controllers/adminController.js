const insertTable = require('../utils/insertTable');
const moment = require('moment-timezone');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const addAdmin = async (req, res) => {
  try {
    const { admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name, admin_password, status } = req.body;

    // Check if an image is uploaded
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

    // Prepare the data for database insertion
    const data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_name,
      admin_password,
      status,
      user_image: filename,  // Save the filename in the database
      created_at: moment().tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss")
    };

    // Insert data into the database
    const result = await insertTable('admins', data);

    res.json({
      status: 0,
      message: 'User added successfully',
      data: {
        insertId: result.insertId
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error adding user',
      error: error.message
    });
  }
};

module.exports = {
  addAdmin
};
