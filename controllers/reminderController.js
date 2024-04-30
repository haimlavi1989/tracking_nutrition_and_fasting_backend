const ReminderModel = require('../models/reminderModel');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

exports.getReminder = factory.getOne(ReminderModel);
exports.updateReminder = factory.updateOne(ReminderModel);
exports.deleteReminder = factory.deleteOne(ReminderModel);

exports.createReminder = async (req, res, next) => {
  try {
    const reminder = new ReminderModel({
        timeToAlertBeforeNutritionStart: req.body.timeToAlertBeforeNutritionStart,
        timeToAlertBeforeFastingStart: req.body.timeToAlertBeforeFastingStart,
        isSentAlertBeforeNutrition: req.body.isSentAlertBeforeNutrition,
        isSentAlertBeforeFasting: req.body.isSentAlertBeforeFasting,
        createdBy: req.user.id,
        dietID: req.body.dietID
    });

    req.reminder = await ReminderModel.create(reminder);
    // Send response with the created post data
    res.status(201).json({
      status: '201',
      data: {
        reminder: req.reminder
      }
    });
  } catch (err) {
    return next(new AppError(err, 500));
  }
};






