const moment = require('moment');
const Log = require('../models/log');

class logger {
    static async log(msg, user, type, data) {
        try {
            const log = new Log({ msg, timeStamp: moment(), user, type, data });
            await log.save();
        } catch {
            return console.log("Log creation failed");
        }
    }
}

module.exports = logger;