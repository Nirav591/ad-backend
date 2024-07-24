const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const register = (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) throw err;

        const newUser = {
            username,
            email,
            password: hashedPassword,
            role
        };

        User.create(newUser, (err, result) => {
            if (err) return res.status(500).json({ message: err.message });

            const token = jwt.sign({ id: result.insertId, role }, 'secretkey', { expiresIn: '1h' });
            res.status(201).json({ token });
        });
    });
};

const login = (req, res) => {
    const { identifier, password } = req.body;

    User.findByEmailOrUsername(identifier, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

            const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
            res.status(200).json({ token });
        });
    });
};

const forgotPassword = (req, res) => {
    const { email } = req.body;

    User.findByEmailOrUsername(email, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length === 0) return res.status(400).json({ message: "Email not found" });

        const user = results[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);

        // Save OTP to user record (omitted for brevity)
        res.status(200).json({ message: 'OTP sent to email' });
    });
};

module.exports = { register, login, forgotPassword };
