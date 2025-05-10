const mongoose = require('mongoose');
const { productPriceUnits } = require('../../config');

// Define Mongoose Schema
const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  priceUnit: { 
    type: String, 
    required: true, 
    default: productPriceUnits.DOLLAR 
  },
});

// Create Mongoose Model
const Product = mongoose.model('Product', productSchema);

module.exports = {
  model: Product,

  // CRUD Methods (Mongoose syntax)
  createProduct: (productData) => Product.create(productData),
  
  findProduct: (query) => Product.findOne(query),
  
  updateProduct: (query, updatedData) => 
    Product.updateOne(query, { $set: updatedData }),
  
  findAllProducts: (query) => Product.find(query),
  
  deleteProduct: (query) => Product.deleteOne(query)
};