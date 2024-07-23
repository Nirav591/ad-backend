const db = require('../models/userModel');

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await db.getAllUsers(); // Define this function in your userModel
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
};

// Function to edit a user by ID
const editUser = async (req, res) => {
    const userId = req.params.userId;
    const { username, email, role } = req.body;

    try {
        const updatedUser = await db.updateUserById(userId, { username, email, role }); // Define this function in your userModel
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user', error: err });
    }
};

module.exports = { getAllUsers, editUser };
