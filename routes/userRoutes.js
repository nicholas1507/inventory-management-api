const express = require('express');
const userRoute = express.Router();
const userController = require('../controllers/UserController');
const profileController = require('../controllers/ProfileController');
const {uploadProfile} = require('../middleware/upload');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

userRoute.use(auth);
//Login only
userRoute.get('/me', profileController.getMyProfile);
userRoute.get('/profile', userController.getMyUser);
userRoute.patch('/me', uploadProfile.single('image'), profileController.updateMyProfil);
userRoute.post('/me', uploadProfile.single('image'),profileController.createProfile);
userRoute.patch('/edit', userController.updateMyUser);

//Login & Authorize
userRoute.get('/', authorize('Super Admin'), userController.getAllUsers);
userRoute.get('/:id', authorize('Super Admin'), userController.getUserById);
userRoute.patch('/:id', authorize('Super Admin'), userController.updateUser);
userRoute.delete('/:id', authorize('Super Admin'), userController.deleteUser);

module.exports = userRoute;