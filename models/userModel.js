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


const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (err) {
        throw err;
    }
};

const updateUserRole = async (userId, newRole) => {
    try {
        const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        return user;
    } catch (err) {
        throw err;
    }
};

module.exports = { createUser, findUserByEmailOrUsername, updateUserPassword , findUserById, updateUserRole };
