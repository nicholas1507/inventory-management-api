const express = require('express');
const productRoute = express.Router();
const productController = require('../controllers/ProductController');
const {productImage} = require('../middleware/upload');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductById);
productRoute.post('/stock', productController.getProductStock);

productRoute.post('/', auth, authorize('Super Admin','Admin'), productImage.single('image'), productController.create);
productRoute.patch('/:id', auth, authorize('Super Admin','Admin'), productImage.single('image'), productController.update);
productRoute.delete('/:id', auth, authorize('Super Admin','Admin'), productController.delete);

module.exports = productRoute;