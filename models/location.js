const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    coordinates: {
        type: Object,
        required: true,
    },
    timeStamp: {
        type: String,
        required: true,
    },
    reporter: {
        type: String,
        required: true,
    }
}, { collection: 'locations' })

module.exports = mongoose.model("location", locationSchema);