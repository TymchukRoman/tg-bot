const Reminder = require('../models/reminder');
const moment = require('moment');

class DB {
    static async createReminder(userID, chatID, firesTime, chatType) {
        try {
            const reminder = new Reminder({
                userID,
                chatID,
                firesTime: moment(firesTime).set('second', 0).format("ddd MMM DD YYYY hh:mm:ss ZZ"),
                created: moment(),
                chatType,
            });
            await reminder.save();
            console.log(`Reminder created`);
            return true;
        } catch (e) {
            console.log(e);
            return false
        }
    }

    static async getActive() {
        try {
            return await Reminder.find({ isActive: true }).clone();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async getReminder(reminderId) {
        try {
            return await Reminder.findOne({ _id: reminderId }).clone();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async fireReminder(reminderId) {
        try {
            return await Reminder.findOneAndUpdate({ _id: reminderId }, {
                $set: { isActive: false }
            });
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

module.exports = DB;