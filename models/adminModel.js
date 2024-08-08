const db = require('../config/db');

// adminModel.js
const insertAdmin = (data) => {
  // Example using MySQL
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO admins (admin_firstname, admin_lastname, admin_email_address, admin_phoneno, user_image, user_name, admin_password, status, added_by, date_added) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.admin_firstname,
      data.admin_lastname,
      data.admin_email_address,
      data.admin_phoneno,
      data.user_image,
      data.user_name,
      data.admin_password,
      data.status,
      data.added_by,
      data.date_added,
    ];

    db.query(query, values, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
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
