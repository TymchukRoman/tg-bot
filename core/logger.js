const moment = require('moment');
const Log = require('../models/logs');

class logger {
    static async log(msg, user) {
        try{
            const log = new Log({ msg, timeStamp: moment(), user });
            await log.save();
        } catch {
            return console.log("Log creation failed");
        }
        console.log(`Log created ${JSON.stringify(user)}`);
    }
}

module.exports = logger;