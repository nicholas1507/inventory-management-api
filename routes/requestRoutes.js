const requestRoute = require('express').Router();
const requestController = require('../controllers/StockRequest');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

requestRoute.use(auth);
// Without authorize
requestRoute.post('/list', requestController.getStockRequests);
requestRoute.get('/:id', requestController.getRequestById);
requestRoute.patch('/:id/cancel', requestController.cancelRequest);
requestRoute.post('/', requestController.createRequest);
requestRoute.get('/:id/reqItems', requestController.detailRequestItems);

// With authorize
requestRoute.patch('/:id/approved', authorize('Super Admin','Admin'), requestController.approvedRequest);
requestRoute.patch('/:id/reject', authorize('Super Admin','Admin'), requestController.rejectRequest);

module.exports = requestRoute;