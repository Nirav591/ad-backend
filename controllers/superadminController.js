const bcrypt = require('bcryptjs');
const Superadmin = require('../models/Superadmin');

exports.createSuperadmin = (req, res) => {
  const { name, email, phone, username, password, confirmPassword, plan, added_by } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const newSuperadmin = {
    name,
    email,
    phone,
    username,
    password: hashedPassword,
    plan,
    added_by,
    date_added: new Date(),
  };

  Superadmin.create(newSuperadmin, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error creating superadmin", error: err });
    }
    res.status(201).json({ message: "Superadmin created successfully", superadminId: result.insertId });
  });
};

exports.updateSuperadmin = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, username, plan, updated_by } = req.body;

  const updatedData = {
    name,
    email,
    phone,
    username,
    plan,
    updated_by,
    date_updated: new Date(),
  };

  Superadmin.update(id, updatedData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error updating superadmin", error: err });
    }
    res.status(200).json({ message: "Superadmin updated successfully" });
  });
};
