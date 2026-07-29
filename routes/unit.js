const unitRoute = require('express').Router();
const UnitController = require('../controllers/UnitController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

unitRoute.use(auth);
unitRoute.get('/', authorize('Admin','Super Admin'), UnitController.getUnits);
unitRoute.post('/', authorize('Admin', 'Super Admin'), UnitController.createUnit);
unitRoute.patch('/:id', authorize('Admin','Super Admin'), UnitController.updateUnit);
unitRoute.delete('/:id', authorize('Admin', 'Super Admin'), UnitController.deleteUnit);

module.exports = unitRoute;