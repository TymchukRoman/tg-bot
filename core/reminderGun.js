const moment = require('moment');
const DB = require('./database');
const fire = require('./fireReminder');
const logger = require('./logger');

module.exports = async (bot) => {
    try {
        const activeReminders = await DB.getActive();
        const localTime = moment().set('second', 0);
        if (activeReminders.length === 0) {
            return true;
        }
        activeReminders.forEach(activeReminder => {
            if (moment(localTime).isSameOrAfter(moment(activeReminder.firesTime, "ddd MMM DD YYYY hh:mm:ss a ZZ"))) {
                fire(bot, activeReminder._id);
            }
        });
        return true;
    } catch (err) {
        logger.log('Issue when checking reminders', 'system', 'ERR', err);
    }
}