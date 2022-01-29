const moment = require('moment');
const DB = require('./database');
const fire = require('./fireReminder');
const logger = require('./logger');

module.exports = async () => {
    try {
        let deletedCounter = 0;
        const unactiveReminders = await DB.getUnactive();
        const clearingTime = moment().set("hour", 0).set("minute", 0).set("second", 0).subtract(2, 'days');
        if (unactiveReminders.length === 0) {
            return true;
        }
        unactiveReminders.forEach(uReminder => {
            if (moment(clearingTime).isSameOrAfter(moment(uReminder.firesTime, "ddd MMM DD YYYY hh:mm:ss a ZZ"))) {
                DB.removeReminder(uReminder._id);
                deletedCounter++;
            }
        });
        console.log(`Cleaned ${deletedCounter} reminders. ${moment().format("ddd MMM DD YYYY HH:mm:ss ZZ")}`);
        return true;
    } catch (err) {
        logger.log('Issue when cleaning reminders', 'system', 'ERR', err);
    }
}