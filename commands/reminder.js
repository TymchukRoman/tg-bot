const moment = require('moment');
const DB = require('../core/database');
const logger = require('../core/logger');
const lParser = require('./parsers/limitParser');
const eParser = require('./parsers/exactParser');
const mParser = require('./parsers/parseMoment');

const limitPattern = /^(([0-9]*h [0-9]*m)|([0-9]*h)|([0-9]*m))$/gi;
const exactTimePattern = /^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])$|^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))$/gi;
const exactDatePattern = /^([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9])$/gi;
const exactTimeDatePattern = /^(([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])|^([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))) ([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9])$/gi;
const exactDateTimePattern = /^([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9])(.|\/)([0-9][0-9]|[0-9][0-9][0-9][0-9]) (([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])|([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm)))$/gi;

module.exports = async (ctx) => {
    try {
        let reminderData = ctx.update.message.text.split("/reminder ")[1];
        console.log(reminderData);
        let reminderTime;
        if (reminderData.includes(".")) {
            reminderData = reminderData.split(".");
            reminderTime = reminderData[0].trim();
        } else {
            reminderTime = reminderData.trim();
        }
        if (!reminderTime) {
            ctx.reply(`Use command /reminder with arguments.\nExample:\n/reminder 2h 10m`);
            return true;
        }
        let firesTime, type;

        if (reminderTime.match(limitPattern)) {

            const [hours, minutes] = lParser(reminderTime);
            type = "time limit";
            if (hours > 10000 || (hours === 10000 && minutes > 0)) {
                return ctx.reply(`Sorry, cant set reminder after ${hours} hours, ${minutes} minutes. 10000 hours is owr maximum(`);
            }
            firesTime = moment().add(hours, 'hours').add(minutes, 'minutes');

        } else if (reminderTime.match(exactTimePattern)) {

            type = "exact time et";
            firesTime = mParser(eParser(reminderTime, 'et'));

        } else if (reminderTime.match(exactDatePattern)) {

            type = "exact time ed";
            firesTime = mParser(eParser(reminderTime, 'ed'));

        } else if (reminderTime.match(exactTimeDatePattern)) {

            type = "exact time etd";
            firesTime = mParser(eParser(reminderTime, 'etd'));

        } else if (reminderTime.match(exactDateTimePattern)) {

            type = "exact time edt";
            firesTime = mParser(eParser(reminderTime, 'edt'));

        } else {
            return ctx.reply(`${reminderTime} did not match any time pattern`);
        }

        const title = Array.isArray(reminderData) && reminderData[1] ? reminderData[1].trim() : "New reminder";
        const description =  Array.isArray(reminderData) && reminderData[2] ? reminderData[2].trim() : "";
        const chatType = ctx.update.message.chat.type;
        const chatId = ctx.update.message.chat.id;
        const userId = ctx.update.message.from.id;
        const username = ctx.update.message.from.username;
        const response = await DB.createReminder(userId, chatId, firesTime, chatType, reminderTime, username, type, title, description);
        if (response) {
            console.log(firesTime);
            ctx.replyWithMarkdown(`${title}, ${description ? description + "," : ""} fires time - *${firesTime.format("dddd, MMM DD YYYY, HH:mm")}*`);
        } else {
            ctx.reply("There is some errors occured when creating a reminder...");
        }
        return true;
    } catch (err) {
        console.log(err);
        logger.log('Cannot create reminder', 'system', 'ERR', err);
    }
} 