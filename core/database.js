const Reminder = require('../models/reminder');
const User = require('../models/user');
const Group = require('../models/group');
const moment = require('moment');
const logger = require('./logger');

class DB {
    static async createReminder(userID, chatID, firesTime, chatType, userInput, username, type, title, description, cycle, isCycling = false) {
        try {
            const remindersLimit = await DB.getUserReminders(userID);
            if (remindersLimit.length >= 5) {
                return 500;
            }

            const reminder = new Reminder({
                userID,
                chatID,
                firesTime: isCycling ? firesTime : moment(firesTime).set('second', 0).format("ddd MMM DD YYYY hh:mm:ss a ZZ"),
                created: moment(),
                chatType,
                userInput,
                username,
                type,
                title,
                description,
                cycle: isCycling ? cycle : null
            });
            const saved = await reminder.save();
            const user = await DB.getUser(userID);
            const reminders = [...user.reminders, saved._id];
            await User.findOneAndUpdate({ id: String(userID) }, {
                $set: { reminders }
            }).clone();
            logger.log('Reminder created', userID, 'INFO', { reminderId: saved._id });
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

    static async getUnactive() {
        try {
            return await Reminder.find({ isActive: false }).clone();
        } catch (err) {
            logger.log('Cant get unactive reminders', 'system', 'ERR', err);
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

    static async getUserReminders(userID) {
        try {
            return await Reminder.find({ userID, isActive: true }).clone();
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
            return logger.log('Cannot fire reminder', 'system', 'ERR', err);
        }
    }

    static async removeReminder(reminderId) {
        try {
            return await Reminder.deleteOne({ _id: reminderId }).clone();
        } catch (err) {
            return logger.log('Cannot remove reminder', 'system', 'ERR', err);
        }
    }

    static async getByChatId(chatID, activeOnly) {
        try {
            const searchParams = activeOnly ? { chatID, isActive: true } : { chatID };
            return await Reminder.find(searchParams).clone();
        } catch (err) {
            logger.log('Cannot fire reminder', 'system', 'ERR', err);
            return [];
        }
    }

    static async createUser({ id, is_bot, first_name, last_name, username, language_code }) {
        try {
            const isCreated = await User.findOne({ id: String(id) }).clone();
            if (isCreated) {
                return false;
            }

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
            logger.log('New user registered', id, 'INFO', { userId: saved._id });
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

    static async getGroup(groupId) {
        try {
            return await Group.findOne({ id: String(groupId) }).clone();
        } catch (err) {
            logger.log('Cannot ger user by id', 'system', 'ERR', { err, id });
            return false;
        }
    }

    static async setTimezone(userId, timeZone) {
        try {
            return await User.findOneAndUpdate({ id: String(userId) }, {
                $set: { timeZone }
            }).clone();
        } catch (err) {
            logger.log('Cannot set user timeZone', 'system', 'ERR', { err, userId });
            return false;
        }
    }

    static async createGroup({ id, title }) {
        try {
            const isCreated = await Group.findOne({ id: String(id) }).clone();
            if (isCreated) {
                return false;
            }

            const group = new Group({
                id: String(id),
                title,
                reminders: [],
                registration_date: moment(),
            });
            const saved = await group.save();
            logger.log('New group registered', id, 'INFO', { userId: saved._id });
            return true;
        } catch (err) {
            logger.log('Cannot save group', 'system', 'ERR', { err, id, title });
            return [];
        }
    }
}

module.exports = DB;