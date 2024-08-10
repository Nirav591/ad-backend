const db = require('../config/db');

const insertTable = async (table, data) => {
  try {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

    const [result] = await db.execute(query, values);

    return result;
  } catch (error) {
    console.error('Error inserting into table:', error);
    throw error;
  }
};

module.exports = insertTable;
