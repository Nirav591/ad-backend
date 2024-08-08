const pool = require('../config/db');

const insertAdmin = async (adminData) => {
  const [result] = await pool.query('INSERT INTO admins SET ?', adminData);
  return result;
};

module.exports = {
  insertAdmin,
};
