const express = require('express');
const categoryRoute = express.Router();
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize'); 

categoryRoute.get('/', CategoryController.getCategories);
categoryRoute.get('/:id', CategoryController.getCategoryById);
categoryRoute.post('/', auth, authorize('Super Admin','Admin'), CategoryController.createCategory);
categoryRoute.put('/:id', auth, authorize('Super Admin','Admin') ,CategoryController.updateCategory);
categoryRoute.delete('/:id', auth, authorize('Super Admin','Admin'), CategoryController.deleteCategory);

module.exports = categoryRoute;