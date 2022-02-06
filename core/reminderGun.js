const moment = require('moment');
const DB = require('./database');
const fire = require('./fireReminder');
const logger = require('./logger');

module.exports = async (bot) => {
    try {
        const counter = {
            cycle: 0,
            oneTime: 0
        };
        const activeReminders = await DB.getActive();
        const localTime = moment().set('second', 0).tz("Etc/GMT+0");
        if (activeReminders.length === 0) {
            return true;
        }
        activeReminders.forEach(activeReminder => {
            try {
                if (activeReminder.type === 'cycling') {
                    counter.cycle++;
                    console.log(localTime.format(activeReminder.cycle.format), activeReminder.firesTime)
                    if (localTime.format(activeReminder.cycle.format) == activeReminder.firesTime) {
                        fire(bot, activeReminder._id);
                    }
                } else {
                    counter.oneTime++;
                    if (moment(localTime).isSameOrAfter(moment(activeReminder.firesTime, "ddd MMM DD YYYY hh:mm:ss a ZZ"))) {

                        fire(bot, activeReminder._id);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        });
        console.log(counter)
        return true;
    } catch (err) {
        logger.log('Issue when checking reminders', 'system', 'ERR', err);
    }
}