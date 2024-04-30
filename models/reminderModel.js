const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const reminderSchema = new mongoose.Schema(
      {
        // dietStartTime: {
        //     type: Date
        // },
        // nutritionNotificationDeliveryTime: Number,
        // fastingNotificationDeliveryTime: Number,
        timeToAlertBeforeNutritionStart: {
            type: Number,
            default: 1 * 5 * 60 * 1000
        },
        timeToAlertBeforeFastingStart: {
            type: Number,
            default: 1 * 5 * 60 * 1000
        },
        isSentAlertBeforeNutrition: {
            type: Boolean,
            default: false,
        },
        isSentAlertBeforeFasting: {
            type: Boolean,
            default: false,
        },
        createdAt: {
          type: Date,
          default: Date(),
          select: false,
        },
        createdBy: {
          type: ObjectId,
          ref: 'User',
        },
        dietID: {
          type: ObjectId,
          ref: 'Diet',
        }
      },
      {
          timestamps: true,
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
      }
  );

// Create a compound index for dietID and createdBy to enforce uniqueness
reminderSchema.index({ dietID: 1 }, { unique: true });
const ReminderModel = mongoose.model('Reminder', reminderSchema);

// userSchema.methods.nutritionNotificationDeliveryTime = function () {
//     const startTimeIsrael = moment(this.startTime).tz('Asia/Jerusalem');
//     startTimeIsrael.subtract(this.timeToAlertBeforeNutritionStart, 'milliseconds');
//     return startTimeIsrael;
// };

module.exports = ReminderModel;
