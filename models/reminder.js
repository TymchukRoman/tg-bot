const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    chatID: {
        type: String,
        required: true,
    },
    firesTime: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    created: {
        type: String,
        required: true,
    },
    isGroupChat: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { collection: 'reminders' })

module.exports = mongoose.model("reminder", reminderSchema);