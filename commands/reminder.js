const moment = require('moment');
const DB = require('../core/database');
const logger = require('../core/logger');
const lParser = require('./parsers/limitParser');
const eParser = require('./parsers/exactParser');

const limitPattern = /^(([0-9]*h [0-9]*m)|([0-9]*h)|([0-9]*m))$/gi;
const exactTimePattern = /^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])$|^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))$/gi;
const exactDatePattern = /^([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9])$/gi;
const exactTimeDatePattern = /^(([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])|^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))) ([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9])$/gi;
const exactDateTimePattern = /^([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9]) (([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])|([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm)))$/gi;

module.exports = async (ctx) => {
    try {
        const reminderTime = ctx.update.message.text.split("/reminder ")[1];
        if (!reminderTime) {
            ctx.reply(`Use command /reminder with arguments.\nExample:\n/reminder 2h 10m`);
            return true;
        }
        let firesTime, hours, minutes;

        if (reminderTime.match(limitPattern)) {

            const [hours, minutes] = lParser(reminderTime);
            if (hours > 10000 || (hours === 10000 && minutes > 0)) {
                return ctx.reply(`Sorry, cant set reminder after ${hours} hours, ${minutes} minutes. 10000 hours is owr maximum(`);
            }
            firesTime = moment().add(hours, 'hours').add(minutes, 'minutes');

        } else if (reminderTime.match(exactTimePattern)) {
            firesTime = eParser(reminderTime, 'et');
            return ctx.reply(`${reminderTime} match et`);
        } else if (reminderTime.match(exactDatePattern)) {
            firesTime = eParser(reminderTime, 'ed');
            return ctx.reply(`${reminderTime} match ed`);
        } else if (reminderTime.match(exactTimeDatePattern)) {
            firesTime = eParser(reminderTime, 'etd');
            return ctx.reply(`${reminderTime} match etd`);
        } else if (reminderTime.match(exactDateTimePattern)) {
            firesTime = eParser(reminderTime, 'edt');
            return ctx.reply(`${reminderTime} match edt`);
        } else {
            return ctx.reply(`${reminderTime} did not match any time pattern`);
        }
        const chatType = ctx.update.message.chat.type;
        const chatId = ctx.update.message.chat.id;
        const userId = ctx.update.message.from.id;
        const username = ctx.update.message.from.username;
        const response = await DB.createReminder(userId, chatId, firesTime, chatType, reminderTime, username, "time limit");
        if (response) {
            ctx.replyWithMarkdown(`You want to set reminder after ${hours} hours, ${minutes} minutes. Reminder fires time - *${firesTime.format("dddd, MMM DD YYYY, HH:mm")}*`);
        } else {
            ctx.reply("There is some errors occured when creating a reminder...");
        }
        return true;
    } catch (err) {
        console.log(err);
        logger.log('Cannot create reminder', 'system', 'ERR', err);
    }
} 