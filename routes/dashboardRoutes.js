const dashboardRoutes = require('express').Router();
const DashboardController = require('../controllers/DashboardController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

dashboardRoutes.use(auth);
dashboardRoutes.get('/summary',authorize("Super Admin","Admin"), DashboardController.dashboardSummary);
dashboardRoutes.get('/user-summary',authorize("User"), DashboardController.userDashboard);

module.exports = dashboardRoutes;