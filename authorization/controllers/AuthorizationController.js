const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../../common/models/User");

const { roles, jwtSecret, jwtExpirationInSeconds } = require("../../config");

// Generates an Access Token using username and userId for the user's authentication
const generateAccessToken = (username, userId) => {
  return jwt.sign(
    {
      userId,
      username,
    },
    jwtSecret,
    {
      expiresIn: jwtExpirationInSeconds,
    }
  );
};

// Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

module.exports = {
  register: async (req, res) => {
    try {
      const payload = req.body;
      const encryptedPassword = encryptPassword(payload.password);
      
      // Set default role if not provided
      payload.role = payload.role || roles.USER;

      // Create user with encrypted password
      const user = await UserModel.createUser({
        ...payload,
        password: encryptedPassword,
      });

      // Generate access token using MongoDB's _id
      const accessToken = generateAccessToken(payload.username, user._id);

      res.status(201).json({
        status: true,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
          },
          token: accessToken,
        },
      });
    } catch (err) {
      // Handle duplicate key errors (MongoDB error code 11000)
      if (err.code === 11000) {
        return res.status(400).json({
          status: false,
          error: "Username or email already exists",
        });
      }
      res.status(500).json({ status: false, error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findUser({ username });

      if (!user) {
        return res.status(404).json({
          status: false,
          error: "User not found",
        });
      }

      const encryptedPassword = encryptPassword(password);

      if (user.password !== encryptedPassword) {
        return res.status(401).json({
          status: false,
          error: "Invalid credentials",
        });
      }

      // Generate access token using MongoDB's _id
      const accessToken = generateAccessToken(user.username, user._id);

      res.status(200).json({
        status: true,
        data: {
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
          },
          token: accessToken,
        },
      });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  },
};