const dotenv = require('dotenv');
const moment = require('moment');
const mongoose = require('mongoose');
const appCreator = require('./core/app');
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
app.start();
app.createTask();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));