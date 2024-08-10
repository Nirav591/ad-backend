const { body, validationResult } = require('express-validator');

const validateAdminData = [
  body('admin_firstname').isString().isLength({ min: 2 }),
  body('admin_lastname').isString().isLength({ min: 2 }),
  body('admin_email_address').isEmail(),
  body('admin_phoneno').isNumeric().isLength({ min: 10, max: 10 }),
  body('user_name').isString().isLength({ min: 5 }),
  body('admin_password').isString().isLength({ min: 8 }),
  body('status').isIn([0, 1]),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateAdminData;
