const movementRoute = require('express').Router();
const movementController = require('../controllers/StockMovement');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

movementRoute.use(auth);
movementRoute.post('/list-requests', authorize('User'),movementController.getMovements);

movementRoute.post('/list', authorize('Super Admin','Admin'), movementController.getMovements);
movementRoute.post('/', authorize('Super Admin', 'Admin'), movementController.createMovement);
movementRoute.get('/', authorize("Super Admin"), movementController.userActivity);

module.exports = movementRoute;