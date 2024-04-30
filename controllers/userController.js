const User = require('./../models/userModel');
const AppError = require('./..//utils/appError');


exports.updateUser = async (req, res, next) => {

  try {

  } catch (err) {
    return next(new AppError(err, 404));
  }
};