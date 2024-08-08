const moment = require('moment-timezone');
const { hashPassword } = require('../utils/helpers');
const { getAdminByDetails, insertAdmin } = require('../models/adminModel');
const path = require('path');
const fs = require('fs');

// Utility function to decode Base64 image
const decodeBase64Image = (base64Str) => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }

  return {
    type: matches[1],
    data: Buffer.from(matches[2], 'base64')
  };
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
      user_image_base64, // Base64 image data
    } = req.body;

    // Validate fields
    if (!admin_firstname || !admin_lastname || !admin_email_address || !admin_phoneno || !user_name || !admin_password || status === undefined) {
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

    // Decode Base64 image and save to file system if provided
    let imageUrl = null;
    if (user_image_base64) {
      const { data, type } = decodeBase64Image(user_image_base64);
      const extension = type.split('/')[1]; // Get file extension from MIME type
      const fileName = `${Date.now()}.${extension}`; // Create a unique file name
      const filePath = path.join(__dirname, '../uploads', fileName);

      // Save the image to the file system
      fs.writeFileSync(filePath, data);
      imageUrl = `/uploads/${fileName}`; // URL for serving the image
    }

    // Prepare data for insertion
    const insert_data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_image: imageUrl, // Set image URL or null if no image
      user_name,
      admin_password: hashedPassword,
      status,
      date_added: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
    };

    // Insert data into the database
    const result = await insertAdmin(insert_data);

    // Send response
    return res.status(201).json({
      status: 0,
      message: 'User added successfully',
      data: {
        insertId: result.insertId, // This is the auto-generated userId from the database
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
