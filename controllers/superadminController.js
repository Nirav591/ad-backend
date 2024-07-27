const bcrypt = require('bcryptjs');
const Superadmin = require('../models/Superadmin');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "79623e001@smtp-brevo.com",
    pass: "HhPTI91mOfkWL4FC",
  },
});

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = 'YOUR_API_V3_KEY';
const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

const createEmailCampaign = () => {
  let emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
  emailCampaigns.name = "Campaign sent via the API";
  emailCampaigns.subject = "My subject";
  emailCampaigns.sender = { "name": "From name", "email": "unizeinventiv@gmail.com" };
  emailCampaigns.type = "classic";
  emailCampaigns.htmlContent = 'Congratulations! You successfully sent this example campaign via the Brevo API.';
  emailCampaigns.recipients = { listIds: [2, 7] };
  emailCampaigns.scheduledAt = '2023-01-01 00:00:01';

  apiInstance.createEmailCampaign(emailCampaigns).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
  }, (error) => {
    console.error(error);
  });
};

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

    // Create an email campaign after successfully creating a superadmin
    createEmailCampaign();
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

exports.getAllSuperadmins = (req, res) => {
  Superadmin.getAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching superadmins", error: err });
    }
    res.status(200).json({ superadmins: results });
  });
};

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;

  console.log(email, "email");

  Superadmin.findByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error finding user", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with that email address" });
    }

    const user = results[0];
    const resetToken = jwt.sign({ email }, "your_reset_password_secret", { expiresIn: '1h' });

    // Calculate expiration time
    const expiresIn = new Date(Date.now() + parseInt(36000));

    Superadmin.updateResetToken(email, resetToken, expiresIn, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating reset token", error: err });
      }

      const resetUrl = `https://advocate.unize.co.in/reset-password?token=${resetToken}`;
      const mailOptions = {
        to: email,
        from: "79623e001@smtp-brevo.com",
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
