module.exports = {
  secret: process.env.JWT_SECRET || 'yoursecretkey',
  expiresIn: '1h',
};
