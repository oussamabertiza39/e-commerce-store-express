const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

module.exports = {
  check: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: false,
        error: 'Authorization header missing',
      });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        status: false,
        error: 'Invalid authorization format',
      });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: false,
          error: 'Invalid or expired token',
        });
      }
      req.user = decoded; // Contains { userId, username }
      next();
    });
  },
};