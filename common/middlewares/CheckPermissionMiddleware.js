const UserModel = require('../models/User');

module.exports = {
  has: (requiredRole) => async (req, res, next) => {
    try {
      const user = await UserModel.findUser({ _id: req.user.userId });

      if (!user) {
        return res.status(403).json({
          status: false,
          error: 'User not found. Invalid token.',
        });
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({
          status: false,
          error: `Requires ${requiredRole} role. Current role: ${user.role}`,
        });
      }

      req.user.role = user.role; // Optional: Attach role to request
      next();
    } catch (err) {
      res.status(500).json({
        status: false,
        error: 'Role verification failed',
      });
    }
  },
};