const db = require('../config/db');

const User = {
    create: (user, callback) => {
        const query = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
        db.query(query, [user.username, user.email, user.password, user.role], callback);
    },
    findByEmailOrUsername: (identifier, callback) => {
        const query = `SELECT * FROM users WHERE email = ? OR username = ?`;
        db.query(query, [identifier, identifier], callback);
    },
    findById: (id, callback) => {
        const query = `SELECT * FROM users WHERE id = ?`;
        db.query(query, [id], callback);
    },
    update: (id, user, callback) => {
        const query = `UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?`;
        db.query(query, [user.username, user.email, user.role, id], callback);
    }
};

module.exports = User;
