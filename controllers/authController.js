const bcrypt = require('bcryptjs');
const { createUser, findUserByEmailOrUsername, updateUserPassword } = require('../models/userModel');
const { generateToken } = require('../utils/tokenUtils');

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

const forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        await updateUserPassword(email, hashedPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Password update failed', error: err });
    }
};

module.exports = { signup, signin, forgotPassword };
