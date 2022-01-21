const moment = require('moment');
const DB = require('../core/database');

const calculateTime = (hours, minutes) => {
    return moment().add(hours, 'hours').add(minutes, 'minutes');;
}

module.exports = async (ctx) => {
    try {
        const reminderTime = ctx.update.message.text.split("reminder ")[1];
        if (!reminderTime) {
            ctx.reply(`Use command /reminder with arguments.\nExample:\n/reminder 2h 10m`);
            return true;
        }
        if (reminderTime && reminderTime.match(/^(([0-9]*h [0-9]*m)|([0-9]*h)|([0-9]*m))$/g)) {
            const times = reminderTime.split(" ");
            let hours, minutes;
            if (times.length === 2) {
                [hours, minutes] = times;
                hours = +hours.slice(0, -1);
                minutes = +minutes.slice(0, -1);
            } else if (times[0].includes("h")) {
                hours = +times[0].slice(0, -1);
                minutes = 0;
            } else if (times[0].includes("m")) {
                hours = 0;
                minutes = +times[0].slice(0, -1);
            }
            if (minutes >= 60) {
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            }
            if (hours > 10000 || (hours === 10000 && minutes > 0)) {
                ctx.reply(`Sorry, cant set reminder after ${hours} hours, ${minutes} minutes. 10000 hours is owr maximum(`);
                return true;
            }
            const firesTime = calculateTime(hours, minutes);
            const chatType = ctx.update.message.chat.type;
            const chatId = ctx.update.message.chat.id;
            const userId = ctx.update.message.from.id;
            const response = await DB.createReminder(userId, chatId, firesTime, chatType);
            if (response) {
                ctx.replyWithMarkdown(`You want to set reminder after ${hours} hours, ${minutes} minutes. Reminder fires time - *${firesTime.format("dddd, MMM DD YYYY, HH:mm")}*`);
            } else {
                ctx.reply("There is some errors occured when creating a reminder...");
            }
            return true;
        }
        ctx.reply(`${reminderTime} did not match any time pattern`);
    } catch (e) {
        console.log(e)
    }
} 