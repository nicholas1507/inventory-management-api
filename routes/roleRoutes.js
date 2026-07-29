const express = require('express');
const roleRoute = express.Router();
const RoleController = require('../controllers/RoleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

roleRoute.use(auth);
roleRoute.get('/', authorize('Super Admin'), RoleController.getAllRoles);
roleRoute.get('/:id', authorize('Super Admin'), RoleController.getRoleById);
roleRoute.post('/', authorize('Super Admin'), RoleController.createRole);
roleRoute.patch('/:id', authorize('Super Admin'), RoleController.updateRole);
roleRoute.delete('/:id', authorize('Super Admin'), RoleController.deleteRole);

module.exports = roleRoute;