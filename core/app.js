const cron = require('node-cron');
const reminderGun = require('./reminderGun');
class app {
    constructor(timestamp, bot) {
        this.timestamp = timestamp;
        this.bot = bot;
    }

    start() {
        this.bot.catch((err, ctx) => {
            console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
        })

        this.bot.launch().then(() => {
            console.log("Bot started");
        });
    }

    createTask() {
        this.task = cron.schedule('* * * * *', () => {
            reminderGun(this.bot);
        });
        console.log("Task created");
    }
}

module.exports = app;