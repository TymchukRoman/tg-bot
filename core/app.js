const cron = require('node-cron');
const reminderGun = require('./reminderGun');
const logger = require('./logger');
const moment = require('moment');

class app {
    constructor(timestamp, bot) {
        this.timestamp = timestamp;
        this.bot = bot;
    }

    start() {
        this.bot.catch((err, ctx) => {
            logger.log('Error catched', 'system', 'ERR', err);
        })

        this.bot.launch().then(() => {
            console.log(`Bot started. ${moment().format("ddd MMM DD YYYY HH:mm:ss ZZ")}`);
        });
    }

    createTask() {
        this.task = cron.schedule('* * * * *', () => {
            reminderGun(this.bot);
        });
        console.log(`Task created. ${moment().format("ddd MMM DD YYYY HH:mm:ss ZZ")}`);
    }
}

module.exports = app;