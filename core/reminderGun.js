const moment = require('moment');
const DB = require('./database');
const fire = require('./fireReminder');

module.exports = async (bot) => {
    try {
        const activeReminders = await DB.getActive();
        const localTime = moment().set('second', 0);
        if (activeReminders.length === 0) {
            return true;
        }
        activeReminders.forEach(activeReminder => {
            if (moment(localTime).isSameOrAfter(moment(activeReminder.firesTime, "ddd MMM DD YYYY hh:mm:ss ZZ"))) {
                fire(bot, activeReminder._id);
            } else {
                console.log(`${activeReminder._id} too early to fire`);
            }
        });
        return true;
    } catch (e) {
        return console.log(String(e).substring(0, 25));
    }
}