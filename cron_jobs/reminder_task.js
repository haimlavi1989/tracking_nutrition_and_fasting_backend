const moment = require('moment-timezone');
const Email = require('./../utils/email');
const ReminderModel = require('../models/reminderModel');
const AppError = require('./../utils/appError');

async function executeReminderTask() {

  try {
    const reminders = await ReminderModel.aggregate([
        {
          $match: {
            $or: [
              { isSentAlertBeforeNutrition: false },
              { isSentAlertBeforeFasting: false }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $lookup: {
            from: 'diets',
            localField: 'dietID',
            foreignField: '_id',
            as: 'diet'
          }
        },
        {
          $project: {
            'user.name': 1,
            'user.email': 1,
            'diet.startTime': 1,
            'diet.createdBy': 1,
            timeToAlertBeforeNutritionStart: 1,
            timeToAlertBeforeFastingStart: 1,
            isSentAlertBeforeNutrition: 1,
            isSentAlertBeforeFasting: 1,
            createdAt: 1
          }
        }
      ]);
      //console.log(reminders);
      let startTime = '';
      const user = {email: "", name: ""};
      reminders.forEach( (reminder) => {
          if (reminder.diet.length === 0 || reminder.user.length === 0 ) {
              return;
          }
          startTime = reminder.diet[0].startTime;
          user.name = reminder.user[0].name;
          user.email = reminder.user[0].email;
          if (reminder.isSentAlertBeforeNutrition === false && reminder.timeToAlertBeforeNutritionStart) {
              const startTimeIsrael = moment(startTime).tz('Asia/Jerusalem');
              startTimeIsrael.subtract(reminder.timeToAlertBeforeNutritionStart, 'milliseconds');
              const currentDateTimeIsrael = moment().tz('Asia/Jerusalem');
              if (currentDateTimeIsrael.isSameOrAfter(startTimeIsrael)) {
                      const dietType = 'Nutrition';
                      const messageBody = `We just wanted to remind you that your ${dietType} will start on ${ moment(moment(startTime).tz('Asia/Jerusalem')).format('MMMM Do YYYY, h:mm:ss a') }
                        Good Luck, your Diet Tracker App.`;
                      const reminderIdToUpdate = reminder._id;
                      const fieldToUpdate = 'isSentAlertBeforeNutrition';
                      const valueToUpdate = true;
                      sendEmailWithCondition(user, messageBody, reminderIdToUpdate, fieldToUpdate, valueToUpdate);
              }
          } else if (reminder.isSentAlertBeforeFasting === false && reminder.timeToAlertBeforeFastingStart) {
              const startTimeIsrael = moment(startTime).tz('Asia/Jerusalem');
              const eightHoursInMillis = 8 * 3600 * 1000;
              startTimeIsrael.add(eightHoursInMillis, 'milliseconds');
              startTimeIsrael.subtract(reminder.timeToAlertBeforeFastingStart, 'milliseconds');
              const currentDateTimeIsrael = moment().tz('Asia/Jerusalem');
              if (currentDateTimeIsrael.isSameOrAfter(startTimeIsrael)) {
                      const dietType = 'Fasting';
                      const messageBody = `We just wanted to remind you that your ${dietType} will start on ${ moment(moment(startTime).tz('Asia/Jerusalem')).format('MMMM Do YYYY, h:mm:ss a') }
                        Good Luck, your Diet Tracker App.`;
                      const reminderIdToUpdate = reminder._id;
                      const fieldToUpdate = 'isSentAlertBeforeFasting';
                      const valueToUpdate = true;
                      sendEmailWithCondition(user, messageBody, reminderIdToUpdate, fieldToUpdate, valueToUpdate);
              }
          }

      });
    } catch (err) {
      console.error(err);
    }
}

function sendEmailWithCondition(user, messageBody, reminderIdToUpdate, fieldToUpdate, valueToUpdate)  {
        try {
            new Email(user, '', messageBody).sendReminder();
            markAsSent(reminderIdToUpdate, fieldToUpdate, valueToUpdate);
        } catch (err) {
           //return new AppError(err, 500);
        }
}

function markAsSent(reminderIdToUpdate, fieldToUpdate, valueToUpdate) {
    const updateFields = {};
    updateFields[fieldToUpdate] = valueToUpdate;
    ReminderModel.findOneAndUpdate(
          { _id: reminderIdToUpdate }, // Specify the filter criteria
          updateFields, // Specify the update to be applied
          { new: true } // Set { new: true } to return the updated document
    )
    .then(updatedReminder => {
        console.log(updatedReminder); // Log the updated reminder document
    })
    .catch(err => {
        console.error(err); // Log any errors that occur during the update process
    });
}

module.exports = {
  executeReminderTask
};