const User = require('../models/userModel');

const getUser = (req, res) => {
    User.findById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json(results[0]);
    });
};

const updateUser = (req, res) => {
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({ message: "Access denied" });
    }

    const { username, email, role } = req.body;

    User.update(req.params.id, { username, email, role }, (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: 'User updated successfully' });
    });
};

module.exports = { getUser, updateUser };
