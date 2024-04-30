const express = require('express');
const Router = express.Router();
const reminderController = require('../controllers/reminderController');
const authController = require('./../controllers/authController');

Router.route('/')
  .post(
     authController.protect,
     authController.restrictTo('user', 'admin'),
     reminderController.createReminder);
Router.route('/:id')
  .get(reminderController.getReminder)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reminderController.updateReminder
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    reminderController.deleteReminder
  );

module.exports = Router;
