const customerRoute = require('express').Router();
const CustomerController = require('../controllers/CustomerController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

customerRoute.use(auth);
customerRoute.get('/', CustomerController.getCustomers);

customerRoute.post('/', authorize('Admin','Super Admin'), CustomerController.createCustomer);
customerRoute.patch('/:id', authorize('Admin', 'Super Admin'), CustomerController.updateCustomer);
customerRoute.delete('/:id', authorize('Admin','Super Admin'), CustomerController.deleteCustomer);

module.exports = customerRoute;