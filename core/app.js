class app {
    constructor(timestamp, bot) {
        this.timestamp = timestamp;
        this.bot = bot;
    }

    start() {
        this.bot.launch().then(() => {
            console.log("Bot started");
        });
    }
}

module.exports = app;