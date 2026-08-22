const movementRoute = require('express').Router();
const movementController = require('../controllers/StockMovement');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

movementRoute.use(auth);
movementRoute.get('/list-requests', authorize('User',"Super Admin"),movementController.getMovements);

movementRoute.get('/list', authorize('Super Admin','Admin'), movementController.getMovements);
movementRoute.post('/', authorize('Super Admin', 'Admin'), movementController.createMovement);
movementRoute.get('/', authorize("Super Admin"), movementController.userActivity);

module.exports = movementRoute;