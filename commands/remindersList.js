const DB = require('../core/database');
const moment = require('moment');

module.exports = async (ctx) => {

    const chatId = ctx.update.message.chat.id;
    const params = ctx.update.message.text.split("/list").filter((param) => param.trim() !== "");
    let activeOnly = true;

    if (Array.isArray(params) && params.some((param) => param.trim().toLowerCase() === "a")) {
        activeOnly = false;
    }

    const reminders = await DB.getByChatId(chatId, activeOnly);

    const user = await DB.getUser(ctx.update.message.from.id);

    const message = reminders.map(reminder => {
        return `${reminder.username} - ${reminder.userInput}\nFires time - ${moment(reminder.firesTime, "ddd MMM DD YYYY hh:mm:ss a ZZ").tz(user.timeZone).format("ddd, MMM DD YYYY, HH:mm")}`
    }).join(`\n\n`);

    ctx.reply(`Got ${reminders.length} reminders!\n${message}`);
} 