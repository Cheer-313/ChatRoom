const mongoose = require("mongoose");

const messgeSchema = mongoose.Schema({
    sender: String,
    room: String,
    message: String,
    time: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("message", messgeSchema);

module.exports = Message;
