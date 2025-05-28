const jwt = require('jsonwebtoken');
const Intern = require('../models/Intern');

const protect = async (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find intern by ID (excluding password)
      req.intern = await Intern.findById(decoded.id).select('-password');

      if (!req.intern) {
        return res.status(401).json({ message: 'Unauthorized: Intern not found' });
      }

      next();
    } catch (error) {
      console.error('Intern auth middleware error:', error);
      return res.status(401).json({ message: 'Unauthorized: Token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = { protect };
