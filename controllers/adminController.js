const { body, validationResult } = require('express-validator');
const insertTable = require('../utils/insertTable');
const moment = require('moment-timezone');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // Assuming you have a DB connection module

const addAdmin = async (req, res) => {
  // Validate incoming request
  await body('admin_firstname').notEmpty().withMessage('First name is required').run(req);
  await body('admin_email_address').isEmail().withMessage('Valid email is required').run(req);
  await body('admin_phoneno').isMobilePhone().withMessage('Valid phone number is required').run(req);
  await body('user_name').notEmpty().withMessage('Username is required').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name, admin_password, status } = req.body;

  try {
    // Check for duplicates in the database for each field
    let [existingAdmin] = await db.query(
      'SELECT * FROM admins WHERE admin_firstname = ?',
      [admin_firstname]
    );
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'First name already exists' });
    }

    [existingAdmin] = await db.query(
      'SELECT * FROM admins WHERE admin_email_address = ?',
      [admin_email_address]
    );
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email address already exists' });
    }

    [existingAdmin] = await db.query(
      'SELECT * FROM admins WHERE admin_phoneno = ?',
      [admin_phoneno]
    );
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    [existingAdmin] = await db.query(
      'SELECT * FROM admins WHERE user_name = ?',
      [user_name]
    );
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

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

const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch admin details by ID from the database
    const [result] = await db.query('SELECT * FROM admins WHERE id = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({
      status: 0,
      message: 'Admin details retrieved successfully',
      data: result[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error retrieving admin details',
      error: error.message
    });
  }
};


module.exports = {
  addAdmin,
  getAdminById
};
