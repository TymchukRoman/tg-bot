const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    reminders: {
        type: Array,
        required: true,
        default: []
    },
    registration_date: {
        type: String,
        required: true,
    }
}, { collection: 'groups' })

module.exports = mongoose.model("group", groupSchema);