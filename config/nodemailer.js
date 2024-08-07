const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '79623e003@smtp-brevo.com',
    pass: "EabP6xJ7fwHqTsND"
  }
});

module.exports = transporter;
