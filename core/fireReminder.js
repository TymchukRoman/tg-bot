const DB = require('./database');
const moment = require('moment');
const Telegraf = require('telegraf');

module.exports = async (bot, reminderId) => {
    const reminder = await DB.getReminder(reminderId);
    bot.telegram.sendMessage(reminder.chatID, "You reminder is here!");
    DB.fireReminder(reminderId);
    return true;
}