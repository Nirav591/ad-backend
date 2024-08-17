const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const insertTable = require('../utils/insertTable');
const moment = require('moment-timezone');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // Assuming you have a DB connection module
const { getAllUsers } = require('../models/userModel');

const baseUrl = 'http://localhost:6315';

const addAdmin = async (req, res) => {
  // Validate incoming request
  await body('admin_firstname').notEmpty().withMessage('First name is required').run(req);
  await body('admin_email_address').isEmail().withMessage('Valid email is required').run(req);
  await body('admin_phoneno').isMobilePhone().withMessage('Valid phone number is required').run(req);
  await body('user_name').notEmpty().withMessage('Username is required').run(req);
  await body('expire_at')
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage('Expiration date must be in DD-MM-YYYY format')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    admin_firstname,
    admin_lastname,
    admin_email_address,
    admin_phoneno,
    user_name,
    admin_password,
    status,
    expire_at,
  } = req.body;

  try {
    // Check for duplicates in the database for each field
    let [existingAdmin] = await db.query('SELECT * FROM admins WHERE admin_firstname = ?', [admin_firstname]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'First name already exists' });
    }

    [existingAdmin] = await db.query('SELECT * FROM admins WHERE admin_email_address = ?', [
      admin_email_address,
    ]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email address already exists' });
    }

    [existingAdmin] = await db.query('SELECT * FROM admins WHERE admin_phoneno = ?', [admin_phoneno]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    [existingAdmin] = await db.query('SELECT * FROM admins WHERE user_name = ?', [user_name]);
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
    await sharp(req.file.buffer).png().toFile(path.join(uploadPath, filename));

    // Convert expire_at from DD-MM-YYYY to YYYY-MM-DD
    const formattedExpireAt = moment(expire_at, 'DD-MM-YYYY').format('YYYY-MM-DD');

    // Hash the password
    const hashedPassword = await bcrypt.hash(admin_password, 10);

    // Generate a token
    const token = jwt.sign(
      { admin_firstname, admin_email_address, user_name },
      'your_jwt_secret_key', // Use an environment variable for production
      { expiresIn: '1h' }
    );

    // Prepare the data for database insertion
    const data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_name,
      admin_password: hashedPassword, // Store the hashed password
      status,
      user_image: filename, // Save the filename in the database
      created_at: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'),
      expire_at: formattedExpireAt, // Use the formatted expiration date
      token, // Save the generated token
    };

    // Insert data into the database
    const result = await insertTable('admins', data);

    res.json({
      status: 0,
      message: 'User added successfully',
      data: {
        insertId: result.insertId,
        token, // Return the token as part of the response
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error adding user',
      error: error.message,
    });
  }
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;

  // Validate incoming request
  await body('admin_firstname').notEmpty().withMessage('First name is required').run(req);
  await body('admin_email_address').isEmail().withMessage('Valid email is required').run(req);
  await body('admin_phoneno').isMobilePhone().withMessage('Valid phone number is required').run(req);
  await body('user_name').notEmpty().withMessage('Username is required').run(req);
  await body('expire_at')
    .matches(/^\d{2}-\d{2}-\d{4}$/)
    .withMessage('Expiration date must be in DD-MM-YYYY format')
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    admin_firstname,
    admin_lastname,
    admin_email_address,
    admin_phoneno,
    user_name,
    admin_password,
    status,
    expire_at,
  } = req.body;

  try {
    // Fetch existing admin details
    let [existingAdmin] = await db.query('SELECT * FROM admins WHERE id = ?', [id]);
    if (existingAdmin.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    existingAdmin = existingAdmin[0];

    // Check for duplicates if email, phone number, or username is being updated
    if (admin_email_address !== existingAdmin.admin_email_address) {
      let [emailExists] = await db.query('SELECT * FROM admins WHERE admin_email_address = ?', [
        admin_email_address,
      ]);
      if (emailExists.length > 0) {
        return res.status(400).json({ message: 'Email address already exists' });
      }
    }

    if (admin_phoneno !== existingAdmin.admin_phoneno) {
      let [phoneExists] = await db.query('SELECT * FROM admins WHERE admin_phoneno = ?', [admin_phoneno]);
      if (phoneExists.length > 0) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    }

    if (user_name !== existingAdmin.user_name) {
      let [usernameExists] = await db.query('SELECT * FROM admins WHERE user_name = ?', [user_name]);
      if (usernameExists.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Prepare the data for database update
    const data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_name,
      status,
      expire_at: moment(expire_at, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    };

    // Handle password update
    if (admin_password) {
      data.admin_password = await bcrypt.hash(admin_password, 10); // Hash new password
    }

    // Handle image update
    if (req.file) {
      // Define the upload path
      const uploadPath = path.join(__dirname, '../upload');

      // Ensure the upload directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Generate a unique filename with PNG extension
      const filename = `${Date.now()}.png`;

      // Save the image as a PNG file
      await sharp(req.file.buffer).png().toFile(path.join(uploadPath, filename));

      data.user_image = filename; // Update image filename
    }

    // Update data in the database
    await db.query('UPDATE admins SET ? WHERE id = ?', [data, id]);

    res.json({
      status: 0,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error updating user',
      error: error.message,
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

    // Generate the image URL
    const admin = result[0];
    admin.user_image_url = `${baseUrl}/upload/${admin.user_image}`;

    res.json({
      status: 0,
      message: 'Admin details retrieved successfully',
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error retrieving admin details',
      error: error.message,
    });
  }
};

// New function to get all admins
const getAllAdmins = async (req, res) => {
  try {
    // Fetch all admin records from the database
    const [results] = await db.query('SELECT * FROM admins');

    // Map the results to include image URLs
    const admins = results.map((admin) => ({
      ...admin,
      user_image_url: `${baseUrl}/upload/${admin.user_image}`,
    }));

    res.json({
      status: 0,
      message: 'All admins retrieved successfully',
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: 'Error retrieving admins',
      error: error.message,
    });
  }
};

module.exports = {
  addAdmin,
  getAdminById,
  getAllAdmins, // Export the new function
  updateAdmin,
};
