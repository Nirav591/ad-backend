const bcrypt = require('bcryptjs');
const { createUser, findUserByEmailOrUsername, updateUserPassword } = require('../models/userModel');
const { createOtp, findOtpByEmailAndOtp, deleteOtpByEmail } = require('../models/otpModel');
const { generateToken } = require('../utils/tokenUtils');
const { sendOtpEmail, generateOtp } = require('../utils/emailUtils');

const signup = async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword, role };
    
    try {
        await createUser(newUser);
        const token = generateToken(newUser);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'User creation failed', error: err });
    }
};

const signin = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await findUserByEmailOrUsername(identifier);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Signin failed', error: err });
    }
};

const forgotPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmailOrUsername(email);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = generateOtp();
        await createOtp(email, otp);
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP', error: err });
    }
};

const resetPassword  = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const validOtp = await findOtpByEmailAndOtp(email, otp);
        if (!validOtp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(email, hashedPassword);
        await deleteOtpByEmail(email);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password', error: err });
    }
};

module.exports = { signup, signin, forgotPasswordRequest, resetPassword  };
