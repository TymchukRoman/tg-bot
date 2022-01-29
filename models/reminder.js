const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    userInput: {
        type: String,
        required: true,
    },
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
    },
    title: {
        type: String,
        required: true,
        default: "New reminder",
    },
    description: {
        type: String,
        default: "",
    },

}, { collection: 'reminders' })

module.exports = mongoose.model("reminder", reminderSchema);