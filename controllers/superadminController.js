const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Superadmin = require('../models/Superadmin');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "unizeinventiv@gmail.com",
    pass: "HhPTI91mOfkWL4FC",
  },
});

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;

  Superadmin.findByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error finding user", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with that email address" });
    }

    const user = results[0];
    const resetToken = jwt.sign({ email }, "your_reset_password_secret", { expiresIn: '1h' });

    Superadmin.updateResetToken(email, resetToken, Date.now() + parseInt(3600000), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating reset token", error: err });
      }

      const resetUrl = `https://advocate.unize.co.in/reset-password?token=${resetToken}`;
      const mailOptions = {
        to: email,
        from: "unizeinventiv@gmail.com",
        subject: 'Password Reset Request',
        text: `To reset your password, click the following link: ${resetUrl}`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error sending email", error: err });
        }
        res.status(200).json({ message: "Password reset email sent" });
      });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { token, newPassword } = req.body;

  jwt.verify(token, "your_reset_password_secret", (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: "Invalid or expired token", error: err });
    }

    Superadmin.findByResetToken(token, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error finding user", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Invalid or expired token" });
      }

      const user = results[0];
      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      Superadmin.updatePassword(user.id, hashedPassword, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error updating password", error: err });
        }

        Superadmin.updateResetToken(user.email, null, null, (err) => {
          if (err) {
            return res.status(500).json({ message: "Error clearing reset token", error: err });
          }
          res.status(200).json({ message: "Password updated successfully" });
        });
      });
    });
  });
};
