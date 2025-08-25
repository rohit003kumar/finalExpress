// utils/genToken.js
const jwt = require('jsonwebtoken');

const genToken = (userId, role = null) => {
  const payload = role ? { userId, role } : { userId };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports = genToken;
