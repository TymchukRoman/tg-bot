const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: String,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    }
}, { collection: 'logs' })

module.exports = mongoose.model("log", logSchema);