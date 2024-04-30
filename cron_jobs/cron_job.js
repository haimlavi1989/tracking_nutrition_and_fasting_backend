const cron = require('node-cron');
const { executeReminderTask } = require('./reminder_task');

const startReminderCronJob = () => {
  // Schedule the cron job to run every minute
  cron.schedule('* * * * *', () => {
    console.log('executeReminderTask cron job');
    executeReminderTask();
  }, {
    scheduled: true,
    timezone: 'Asia/Jerusalem' // Israel timezone
  });
};

module.exports = startReminderCronJob;


