const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const responseHandler = require('../utils/responseHandler');

const createAdmin = async (req, res) => {
  try {
    const { admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name, admin_password, status } = req.body;

    // Check if email already exists
    const existingAdmin = await new Promise((resolve, reject) => {
      Admin.findByEmail(admin_email_address, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    if (existingAdmin.length > 0) {
      return responseHandler(res, 400, 'Email already in use');
    }

    const hashedPassword = await bcrypt.hash(admin_password, 10);
    
    const newAdmin = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_image: req.file ? req.file.path : null,
      user_name,
      admin_password: hashedPassword,
      status,
      userId: null  // Will be generated automatically by MySQL if using AUTO_INCREMENT
    };

    Admin.create(newAdmin, (err, result) => {
      if (err) {
        return responseHandler(res, 500, 'Failed to create admin', err);
      }
      responseHandler(res, 201, 'Admin created successfully', { userId: result.insertId });
    });

  } catch (error) {
    responseHandler(res, 500, 'Server Error', error.message);
  }
};

module.exports = { createAdmin };
