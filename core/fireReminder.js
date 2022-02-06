const DB = require('./database');
const moment = require('moment');
const Telegraf = require('telegraf');

module.exports = async (bot, reminderId) => {
    const reminder = await DB.getReminder(reminderId);
    bot.telegram.sendMessage(reminder.chatID, `${reminder.title} is here! ${reminder.description}`);
    if (reminder.type !== 'cycling') {
        DB.fireReminder(reminderId);
    }
    return true;
}