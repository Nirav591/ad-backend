require('dotenv').config();
module.exports = {
    port: 6315,
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key'
};
