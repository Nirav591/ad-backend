const moment = require('moment-timezone');
const { insertAdmin } = require('../models/adminModel');
const { hashPassword } = require('../utils/helpers');

const addAdmin = async (req, res) => {
  try {
    const { admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_image, user_name, admin_password, status, userId } = req.body;

    // Hash password
    const hashedPassword = await hashPassword(admin_password);

    // Prepare data for insertion
    const insert_data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_image,
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
        insertId: result.insertId,
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
