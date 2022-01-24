const Reminder = require('../models/reminder');
const User = require('../models/user');
const moment = require('moment');
const logger = require('./logger');

class DB {
    static async createReminder(userID, chatID, firesTime, chatType, userInput, username, type) {
        try {
            const reminder = new Reminder({
                userID,
                chatID,
                firesTime: moment(firesTime).set('second', 0).format("ddd MMM DD YYYY hh:mm:ss a ZZ"),
                created: moment(),
                chatType,
                userInput,
                username,
                type,
            });
            const saved = await reminder.save();
            logger.log('Reminder created', userID, 'ERR', { reminderId: saved._id });
            return true;
        } catch (err) {
            logger.log('Reminder creation error', userID, 'ERR', err);
            return false;
        }
    }

    static async getActive() {
        try {
            return await Reminder.find({ isActive: true }).clone();
        } catch (err) {
            logger.log('Cant get active reminders', 'system', 'ERR', err);
            return [];
        }
    }

    static async getReminder(reminderId) {
        try {
            return await Reminder.findOne({ _id: reminderId }).clone();
        } catch (err) {
            logger.log('Cannot ger reminder by id', 'system', 'ERR', err);
            return false;
        }
    }

    static async fireReminder(reminderId) {
        try {
            return await Reminder.findOneAndUpdate({ _id: reminderId }, {
                $set: { isActive: false }
            }).clone();
        } catch (err) {
            logger.log('Cannot fire reminder', 'system', 'ERR', err);
            return false;
        }
    }

    static async getByChatId(chatID) {
        try {
            return await Reminder.find({ chatID }).clone();
        } catch (err) {
            logger.log('Cannot fire reminder', 'system', 'ERR', err);
            return [];
        }
    }

    static async createUser({ id, is_bot, first_name, last_name, username, language_code }) {
        try {
            const user = new User({
                id: String(id),
                is_bot,
                first_name: first_name ? first_name : "empty",
                last_name: last_name ? last_name : "empty",
                username,
                language_code,
                registration_date: moment(),
            });
            const saved = await user.save();
            logger.log('New user registered', id, 'ERR', { userId: saved._id });
            return true;
        } catch (err) {
            logger.log('Cannot save user', 'system', 'ERR', { err, id, is_bot, first_name, last_name, username, language_code });
            return [];
        }
    }

    static async getUser(userId) {
        try {
            return await User.findOne({ id: String(userId) }).clone();
        } catch (err) {
            logger.log('Cannot ger user by id', 'system', 'ERR', { err, id });
            return false;
        }
    }
}

module.exports = DB;