const express = require('express');
const Router = express.Router();
const dietController = require('../controllers/dietController');
const authController = require('./../controllers/authController');

Router.route('/')
  .get(
     authController.protect,
     authController.restrictTo('user', 'admin'),
     dietController.getAllForSpecificUserID)
  .post(
     authController.protect,
     authController.restrictTo('user', 'admin'),
     dietController.createDiet);

Router.route('/:id')
  .get(dietController.getDiet)
  .patch(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    dietController.updateDiet
  )
  .delete(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    dietController.deleteDiet
  );

Router.route('/user/:userid/weights')
  .get(
     authController.protect,
     authController.restrictTo('user', 'admin'),
     dietController.getDietWeightsForSpecificUserId);

module.exports = Router;
