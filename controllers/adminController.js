const moment = require('moment-timezone');
const { hashPassword } = require('../utils/helpers');
const { getAdminByDetails, insertAdmin } = require('../models/adminModel');
const path = require('path');
const fs = require('fs');

// Utility function to get the URL or Base64 representation of the image
const getImageData = (file) => {
  const filePath = path.join(__dirname, '../uploads', file.filename);
  const imageBase64 = fs.readFileSync(filePath).toString('base64');
  const imageUrl = `/uploads/${file.filename}`; // URL for serving the image
  return { imageBase64, imageUrl };
};

const addAdmin = async (req, res) => {
  try {
    const {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_name,
      admin_password,
      status,
      userId,
    } = req.body;

    // Check if the file exists
    const userImageFile = req.file;

    // Validate fields
    if (!admin_firstname || !admin_lastname || !admin_email_address || !admin_phoneno || !user_name || !admin_password || status === undefined || !userId) {
      return res.status(400).json({
        status: 1,
        message: 'Missing required fields',
      });
    }

    // Check if an admin with the same details already exists
    const existingAdmin = await getAdminByDetails(admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name);
    
    if (existingAdmin) {
      return res.status(400).json({
        status: 1,
        message: 'An admin with the same details already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(admin_password);

    // Prepare data for insertion
    const insert_data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_image: userImageFile ? `/uploads/${userImageFile.filename}` : null, // Set image URL or null if no image
      user_name,
      admin_password: hashedPassword,
      status,
      added_by: userId,
      date_added: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
    };

    // Insert data into the database
    const result = await insertAdmin(insert_data);

    // Send response
    return res.status(201).json({
      status: 0,
      message: 'User added successfully',
      data: {
        insertId: result.insertId, // This is the auto-generated userId
        imageUrl: insert_data.user_image, // Include image URL in the response
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 1,
      message: 'Error adding user',
      error: err.message,
    });
  }
};

module.exports = {
  addAdmin,
};
