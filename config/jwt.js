module.exports = {
  secret: process.env."your_jwt_secret" || 'yoursecretkey',
  expiresIn: '1h',
};
