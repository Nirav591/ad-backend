const db = require('../config/db');

const createUser = async (user) => {
    const { username, email, password, role } = user;
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, password, role]
    );
    return result;
};

const findUserByEmailOrUsername = async (identifier) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [identifier, identifier]
    );
    return rows[0];
};

const updateUserPassword = async (email, password) => {
    const [result] = await db.execute(
        'UPDATE users SET password = ? WHERE email = ?',
        [password, email]
    );
    return result;
};

const getAllUsers = async () => {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
};

const updateUserById = async (userId, updatedFields) => {
    const { username, email, role } = updatedFields;
    const [result] = await db.execute(
        'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
        [username, email, role, userId]
    );
    return result;
};

const findUserById = async (userId) => {
    const [rows] = await db.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
    );
    return rows[0];
};

module.exports = { createUser, findUserByEmailOrUsername, updateUserPassword, getAllUsers, updateUserById , findUserById};
