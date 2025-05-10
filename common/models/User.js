const mongoose = require('mongoose');
const { roles } = require('../../config');

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    default: roles.USER 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  }
});

// Create Mongoose Model
const User = mongoose.model('User', userSchema);

module.exports = {
  // Directly export the model instead of using `initialise`
  model: User,

  // CRUD Methods (Mongoose syntax)
  createUser: (userData) => User.create(userData),
  
  findUser: (query) => User.findOne(query),
  
  updateUser: (query, updatedData) => 
    User.updateOne(query, { $set: updatedData }),
  
  findAllUsers: (query) => User.find(query),
  
  deleteUser: (query) => User.deleteOne(query)
};