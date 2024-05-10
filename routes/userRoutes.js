const express = require('express');
const Router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const signupValidation = require('../validation/signupValidation');
const validationMiddleware = require('../validation/validationMiddleware');

Router.post('/signup',
  signupValidation.signupValidationRules(),
  validationMiddleware.validateRequest,
  authController.signup);
Router.post('/login',
  authController.login
);

Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

/*
Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
*/
Router.route('/:id');
  //.get(userController.getUser)
  //.delete(userController.deleteUser);

// Router.route('/updateUser')
// .patch(userController.updateUser);


module.exports = Router;
