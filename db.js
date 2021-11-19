const credential = require("./creadential");
const mongoose = require("mongoose");
const Message = require("./models/messages");

// Check connection string
const connectionString = credential.mongo.connectionString;
if (!connectionString) {
    console.error("MongoDB connection string missing!");

    process.exit(1);
}

// Connect to database
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => {
    console.error("MongoDB error: " + err.message);

    process.exit(1);
});
db.once("open", () => console.log("MongoDB connection established"));


// Get message from db
Message.find((err, Messages) => {
    if (err) return console.error(err);

    if (!Messages.length)
        return new Message({
            sender: 'Bot',
            room: 'BotRoom',
            message: 'None'
        }).save();
});

module.exports = {
    getMessages: async (options = {}) => Message.find(options),

    addMessages: async(user, message) => {
        try{
            return new Message({
                sender: user.username,
                room: user.room,
                message: message,
            }).save();
        } catch(err){
            console.log(err);
        }
    }
};
