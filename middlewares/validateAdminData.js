const { check, validationResult } = require('express-validator');

const validateAdminData = [
  check('admin_firstname').isString().withMessage('First name must be a string'),
  check('admin_lastname').isString().withMessage('Last name must be a string'),
  check('admin_email_address').isEmail().withMessage('Must be a valid email address'),
  check('admin_phoneno').isMobilePhone().withMessage('Must be a valid phone number'),
  check('user_name').isString().withMessage('Username must be a string'),
  check('admin_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('status').isIn(['active', 'inactive']).withMessage('Status must be either "active" or "inactive"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateAdminData;
