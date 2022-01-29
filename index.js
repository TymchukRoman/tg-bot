const dotenv = require('dotenv');
const moment = require('moment');
const mongoose = require('mongoose');
const appCreator = require('./core/app');
const logger = require('./core/logger');
dotenv.config();

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("error", err => {
    console.log("Error: ", err)
});
mongoose.connection.on("connected", (err, res) => {
    console.log("Mongoose is connected")
});

const bot = require('./core/bot.js');

const app = new appCreator(moment(), bot);
try {
    app.start();
    app.createTask();
    app.createCleaner();
} catch (err) {
    logger.log('App starting failed', "system", 'ERR', err);
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));