const ProductModel = require("../../common/models/Product");

module.exports = {
  getAllProducts: (req, res) => {
    const { query: filters } = req;

    ProductModel.findAllProducts(filters)
      .then((products) => {
        return res.status(200).json({
          status: true,
          data: products, // No need for .toJSON() in Mongoose
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err.message, // Improved error messaging
        });
      });
  },

  getProductById: (req, res) => {
    const { productId } = req.params;

    ProductModel.findProduct({ _id: productId }) // Changed 'id' to '_id'
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            status: false,
            error: "Product not found",
          });
        }
        return res.status(200).json({
          status: true,
          data: product, // Mongoose docs are already plain objects
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err.message,
        });
      });
  },

  createProduct: (req, res) => {
    const { body } = req;

    ProductModel.createProduct(body)
      .then((product) => {
        return res.status(201).json({ // 201 Created is more appropriate
          status: true,
          data: product,
        });
      })
      .catch((err) => {
        return res.status(400).json({ // 400 for validation errors
          status: false,
          error: err.message,
        });
      });
  },

  updateProduct: (req, res) => {
    const { productId } = req.params;
    const payload = req.body;

    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: "Body is empty, hence cannot update the product.",
      });
    }

    ProductModel.updateProduct({ _id: productId }, payload)
      .then(() => ProductModel.findProduct({ _id: productId }))
      .then((updatedProduct) => {
        return res.status(200).json({
          status: true,
          data: updatedProduct,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err.message,
        });
      });
  },

  deleteProduct: (req, res) => {
    const { productId } = req.params;

    ProductModel.deleteProduct({ _id: productId })
      .then((result) => {
        return res.status(200).json({
          status: true,
          data: {
            numberOfProductsDeleted: result.deletedCount, // Mongoose returns delete count
          },
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err.message,
        });
      });
  },
};