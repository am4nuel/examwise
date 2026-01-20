const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // If token is invalid, we just proceed as unauthenticated instead of failing
    next();
  }
};

module.exports = optionalAuth;
