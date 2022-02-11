const moment = require('moment');
const DB = require('../core/database');
const logger = require('../core/logger');
const parseCycle = require('./parsers/parseCycle');

module.exports = async (ctx) => {
    try {
        const patterns = {
            dayCycle: /^day($| (([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])$|([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))$))/gi,
            weekCycle: /^week($| ([a-z|A-Z]+)($| (([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])$|([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))$)))/gi,
            monthCycle: /^month($| ([0-9][0-9]|[0-9])($| (([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])$|([0-9][0-9]|[0-9]):([0-9][0-9]|[0-9])( (am|pm)|(am|pm))$)))/gi,
        };
        let reminderData = ctx.update.message.text.split("/c")[1].trim();
        let [cycleData, title, description] = reminderData.split(".");
        if (!cycleData) {
            return ctx.reply(`Use command /c with arguments.\nExample:\n/c day 01:00`);
        }
        const userId = ctx.update.message.from.id;
        const user = await DB.getUser(userId);
        let cycle;
        switch (true) {
            case patterns.dayCycle.test(cycleData.trim()): {
                cycle = parseCycle(cycleData.trim(), 'day', user.timeZone);
                break;
            }
            case patterns.weekCycle.test(cycleData.trim()): {
                cycle = parseCycle(cycleData.trim(), 'week', user.timeZone);
                break;
            }
            case patterns.monthCycle.test(cycleData.trim()): {
                cycle = parseCycle(cycleData.trim(), 'month', user.timeZone);
                break;
            }
            default: {
                return ctx.reply(`${cycleData.trim()} did not match any cycle pattern`);
            }
        }

        title = title || "New reminder";
        description = description || "";
        const chatType = ctx.update.message.chat.type;
        const chatId = ctx.update.message.chat.id;
        const username = ctx.update.message.from.username;
        const type = 'cycling';

        const response = await DB.createReminder(userId, chatId, cycle.time, chatType, reminderData, username, type, title, description, cycle, true);
        if (response) {
            if (response === 500) return ctx.replyWithMarkdown("You reach limit of active reminders)");
            ctx.replyWithMarkdown(`${title}, ${description ? description + "," : ""} fires - *${cycleData}*`);
        } else {
            ctx.reply("There is some errors occured when creating a reminder...");
        }
        return true;
    } catch (err) {
        console.log(err);
        logger.log('Cannot create reminder', 'system', 'ERR', err);
    }
} 