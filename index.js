const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("error", err => {
    console.log("Error: ", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("Mongoose is connected")
})

const bot = require('./core/bot.js');

bot.launch().then(() => {
    console.log("Bot started");
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));