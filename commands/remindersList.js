const DB = require('../core/database');
const moment = require('moment');

module.exports = async (ctx) => {

    const chatId = ctx.update.message.chat.id;

    const reminders = await DB.getByChatId(chatId);

    const message = reminders.map(reminder => {
        return `${reminder.username} - ${reminder.userInput}\nFires time - ${moment(reminder.firesTime, "ddd MMM DD YYYY hh:mm:ss a ZZ").format("ddd, MMM DD YYYY, HH:mm")}`
    }).join(`\n\n`);

    ctx.reply(`Got ${reminders.length} reminders!\n${message}`);
} 