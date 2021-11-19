const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utills/message');
const {userJoin, getCurrentUser, userLeaveChat, getRoomUsers} = require("./utills/user");
const { response } = require('express');
const db = require("./db");
const { addMessages, getMessages } = require('./db');

const port = 3000 || process.env.port;
const chatBot = 'System';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connect
io.on('connection', socket =>{

    socket.on('joinRoom', async ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        try {
            socket.join(user.room);

            // Get existed message and emit to current user
            const result = await getMessages({ room: user.room });
            result.forEach((message) => {
                console.log(message);
                socket.emit("msg", formatMessage(message.sender, message.message, 1));
            });

            // Send to the current user
            socket.emit("msg", formatMessage(chatBot, `Welcome to ${user.room} room!`));

            //Send info current user
            socket.emit("infoCurrentUser", user.id);
        } catch (e) {
            console.error(e);
        }

        // Send to all users in room except current user
        socket.broadcast.to(user.room).emit("msg",formatMessage(chatBot, `${user.username} has join the chat`));
        
        // Send user and room info to client
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chat Message
    socket.on("chatMessage", async (message) => {
        const user = getCurrentUser(socket.id);

        // Update message to database
        await addMessages(user, message);

        io.to(user.room).emit("msg", formatMessage(user.username, message, user.id));
    });

    // Run when client disconnect
    socket.on("disconnect", () => {
        const user = userLeaveChat(socket.id);

        if (user) {
            io.emit("msg", formatMessage(chatBot, `${user.username} has left the chat`));
        }

        // Send user and room info to client
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });
});

server.listen(port, () =>{
    try{
        // await client.connect();
        // collection = client.db("ChatCordDB").collection('chats');
        console.log(`Server is running on port ${port}`);
    }
    catch(e){
        console.error(e);
    }
});