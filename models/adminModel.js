const pool = require('../config/db');

const insertAdmin = async (adminData) => {
  const [result] = await pool.query('INSERT INTO admins SET ?', adminData);
  return result;
};

const getAdminByDetails = async (admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name) => {
  const [rows] = await pool.query(
    'SELECT * FROM admins WHERE admin_firstname = ? AND admin_lastname = ? AND admin_email_address = ? AND admin_phoneno = ? AND user_name = ?',
    [admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_name]
  );
  
  if (rows.length > 0) {
    return rows[0]; // Return the found admin
  } else {
    return null; // No match found
  }
};


module.exports = {
  insertAdmin,
  getAdminByDetails
};
