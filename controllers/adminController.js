const insertTable = require('../utils/insertTable');
const moment = require('moment-timezone');

// Handle insertion of admin data
const addAdmin = async (req, res) => {
  try {
    const { admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name, admin_password, status } = req.body;

    const data = {
      admin_firstname,
      admin_lastname,
      admin_email_address,
      admin_phoneno,
      user_name,
      admin_password,
      status,
      created_at: moment().tz('Asia/Kolkata').format("YYYY-MM-DD HH:mm:ss")
    };

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
