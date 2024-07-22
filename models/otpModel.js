const db = require('../config/db');

const createOtp = async (email, otp) => {
    const [result] = await db.execute(
        'INSERT INTO otps (email, otp, createdAt) VALUES (?, ?, NOW())',
        [email, otp]
    );
    return result;
};

const findOtpByEmailAndOtp = async (email, otp) => {
    const [rows] = await db.execute(
        'SELECT * FROM otps WHERE email = ? AND otp = ? AND createdAt >= NOW() - INTERVAL 15 MINUTE',
        [email, otp]
    );
    return rows[0];
};

const deleteOtpByEmail = async (email) => {
    const [result] = await db.execute(
        'DELETE FROM otps WHERE email = ?',
        [email]
    );
    return result;
};

module.exports = { createOtp, findOtpByEmailAndOtp, deleteOtpByEmail };
