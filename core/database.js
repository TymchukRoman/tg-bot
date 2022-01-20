const Reminder = require('../models/reminder');
const moment = require('moment');

class DB {
    static async createReminder(userID, chatID, firesTime, chatType) {
        try{
            const reminder = new Reminder({
                userID,
                chatID,
                firesTime,
                created: moment(),
                chatType,
            });
            await reminder.save();
        } catch {
            return console.log("Reminder creation failed");
        }
        console.log(`Reminder created`);
    }
}

module.exports = DB;