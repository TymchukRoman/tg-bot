const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    is_bot: {
        type: Boolean,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    language_code: {
        type: String,
        required: true,
    },
    registration_date: {
        type: String,
        required: true,
    },
    timeZone: {
        type: String,
        required: true,
        default: "Etc/GMT+0"
    }
}, { collection: 'users' })

module.exports = mongoose.model("user", userSchema);