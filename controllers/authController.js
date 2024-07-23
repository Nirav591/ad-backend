const bcrypt = require('bcryptjs');
const { createUser, findUserByEmailOrUsername, updateUserPassword , updateUserRole, findUserById} = require('../models/userModel');
const { createOtp, findOtpByEmailAndOtp, deleteOtpByEmail } = require('../models/otpModel');
const { generateToken } = require('../utils/tokenUtils');
const { sendOtpEmail, generateOtp } = require('../utils/emailUtils');
const { v4: uuidv4 } = require('uuid');



const signup = async (req, res) => {
    const { username, email, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4(); // Generate a unique user ID
    const newUser = { userId, username, email, password: hashedPassword, role };
    
    try {
        await createUser(newUser); // Assuming createUser inserts newUser into the database
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

const resetPassword = async (req, res) => {
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

const getUser = async (req, res) => {
    const userId = req.params.id; // Assuming id is passed as a route parameter

    try {
        const user = await findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return relevant user details, excluding sensitive information like password
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
            // Add more fields as needed
        });
    } catch (err) {
        console.error('Error fetching user details:', err); // Log the actual error
        res.status(500).json({ message: 'Failed to fetch user details', error: err.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id; // Assuming id is passed as a route parameter
    const { role } = req.body;

    try {
        const updatedUser = await updateUserRole(userId, role);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User role updated successfully',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
                // Add more fields as needed
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user role', error: err });
    }
};


module.exports = { signup, signin, forgotPasswordRequest, resetPassword, updateUser , getUser};
