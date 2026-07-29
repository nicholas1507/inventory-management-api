const express = require('express');
const supplierRoute = express.Router();
const SupplierController = require('../controllers/SupplierController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

supplierRoute.use(auth);
supplierRoute.get('/', authorize("Admin","Super Admin"), SupplierController.getSuppliers);
supplierRoute.post('/', authorize('Admin','Super Admin'), SupplierController.createSupplier);
supplierRoute.patch('/:id', authorize('Admin','Super Admin'), SupplierController.updateSupplier);
supplierRoute.delete('/:id', authorize('Admin','Super Admin'), SupplierController.deleteSupplier);

module.exports = supplierRoute;