const jwt = require('jsonwebtoken');
const Supervisor = require('../models/Supervisor');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
      }

      const supervisor = await Supervisor.findById(decoded.id).select('-password');

      if (!supervisor) {
        return res.status(401).json({ message: 'Unauthorized: Supervisor not found' });
      }

      req.supervisor = supervisor;
      next();
    } catch (error) {
      console.error('Auth error:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      }

      return res.status(401).json({ message: 'Unauthorized: Token invalid or malformed' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};

module.exports = { protect };
