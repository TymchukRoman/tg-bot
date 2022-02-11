const moment = require('moment');
const DB = require('../core/database');
const logger = require('../core/logger');
const limitParser = require('./parsers/limitParser');
const exactParser = require('./parsers/exactParser');
const momentParser = require('./parsers/parseMoment');
const patterns = require('../constants/reminderPatterns');
const exactValidator = require('./validators/exactValidator');

const { limitPattern, exactTimePattern, exactDatePattern, exactTimeDatePattern, exactDateTimePattern } = patterns;

module.exports = async (ctx, cmdsep) => {
    try {
        let reminderData = ctx.update.message.text.split(`${cmdsep} `)[1];

        if (!reminderData) {
            ctx.reply(`Use command ${cmdsep} with arguments.\nExample:\n${cmdsep} 2h 10m`);
            return true;
        }

        let reminderTime, firesTime, type;

        if (reminderData.includes(".")) {
            reminderData = reminderData.split(".");
            reminderTime = reminderData[0].trim();
        } else {
            reminderTime = reminderData.trim();
        }

        if (!reminderTime) {
            ctx.reply(`Use command ${cmdsep} with arguments.\nExample:\n${cmdsep} 2h 10m`);
            return true;
        }

        if (reminderTime.match(limitPattern)) {

            const [hours, minutes] = limitParser(reminderTime);
            type = "time limit";
            if (hours > 10000 || (hours === 10000 && minutes > 0)) {
                return ctx.reply(`Sorry, cant set reminder after ${hours} hours, ${minutes} minutes. 10000 hours is owr maximum(`);
            }
            firesTime = moment().add(hours, 'hours').add(minutes, 'minutes');

        } else if (reminderTime.match(exactTimePattern)) {

            type = "exact time et";
            firesTime = momentParser(exactParser(reminderTime, 'et'));

        } else if (reminderTime.match(exactDatePattern)) {

            type = "exact time ed";
            firesTime = momentParser(exactParser(reminderTime, 'ed'));

        } else if (reminderTime.match(exactTimeDatePattern)) {

            type = "exact time etd";
            firesTime = momentParser(exactParser(reminderTime, 'etd'));

        } else if (reminderTime.match(exactDateTimePattern)) {

            type = "exact time edt";
            firesTime = momentParser(exactParser(reminderTime, 'edt'));

        } else {
            return ctx.reply(`${reminderTime} did not match any time pattern`);
        }

        const title = Array.isArray(reminderData) && reminderData[1] ? reminderData[1].trim() : "New reminder";
        const description = Array.isArray(reminderData) && reminderData[2] ? reminderData[2].trim() : "";
        const chatType = ctx.update.message.chat.type;
        const chatId = ctx.update.message.chat.id;
        const userId = ctx.update.message.from.id;
        const username = ctx.update.message.from.username;

        const user = await DB.getUser(userId);

        if (type !== 'time limit') {
            const localTime = moment.tz(firesTime.format().split('+')[0], user.timeZone);
            firesTime = localTime.clone().tz("Etc/GMT+0");
            firesTime = exactValidator(firesTime, type);
            if (!firesTime) {
                return ctx.reply("Reminder time cannot be in past");
            }
        }

        const response = await DB.createReminder(userId, chatId, firesTime, chatType, reminderTime, username, type, title, description);
        if (response) {
            if (response === 500) return ctx.replyWithMarkdown("You reach limit of active reminders)");
            ctx.replyWithMarkdown(`${title}, ${description ? description + "," : ""} fires time - *${firesTime.tz(user.timeZone).format("dddd, MMM DD YYYY, HH:mm")}*`);
        } else {
            ctx.reply("There is some errors occured when creating a reminder...");
        }
        return true;
    } catch (err) {
        console.log(err);
        logger.log('Cannot create reminder', 'system', 'ERR', err);
    }
} 