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
}

module.exports = app;