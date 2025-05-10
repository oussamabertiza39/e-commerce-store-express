const UserModel = require("../../common/models/User");

module.exports = {
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findUser({ _id: req.user.userId });
      
      if (!user) {
        return res.status(404).json({
          status: false,
          error: "User not found",
        });
      }

      res.status(200).json({
        status: true,
        data: user.toObject(),
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { userId } = req.user;
      const payload = req.body;

      if (!Object.keys(payload).length) {
        return res.status(400).json({
          status: false,
          error: "Body is empty, cannot update user",
        });
      }

      const updateResult = await UserModel.updateUser({ _id: userId }, payload);
      
      if (updateResult.modifiedCount === 0) {
        return res.status(400).json({
          status: false,
          error: "No changes made or user not found",
        });
      }

      const updatedUser = await UserModel.findUser({ _id: userId });
      res.status(200).json({
        status: true,
        data: updatedUser.toObject(),
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const deleteResult = await UserModel.deleteUser({ _id: userId });

      res.status(200).json({
        status: true,
        data: {
          numberOfUsersDeleted: deleteResult.deletedCount,
        },
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await UserModel.findAllUsers(req.query);
      res.status(200).json({
        status: true,
        data: users.map(user => user.toObject()),
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },

  changeRole: async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const updateResult = await UserModel.updateUser({ _id: userId }, { role });
      
      if (updateResult.modifiedCount === 0) {
        return res.status(400).json({
          status: false,
          error: "Role not updated or user not found",
        });
      }

      const updatedUser = await UserModel.findUser({ _id: userId });
      res.status(200).json({
        status: true,
        data: updatedUser.toObject(),
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
};