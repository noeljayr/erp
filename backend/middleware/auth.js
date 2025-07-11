const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ user_id: decoded.user_id });

    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = {
      id: user.user_id,
      role: user.role,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
    };

    next();
  } catch (err) {
    console.error('JWT error:', err);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
