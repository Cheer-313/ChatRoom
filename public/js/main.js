const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from query
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chat room
socket.emit('joinRoom', ({username, room}))

// Get ID of current user
socket.on('infoCurrentUser', userID => {
    sessionStorage.setItem('userID', userID);
})


// Get room and users info
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('msg', message =>{
    console.log(message);
    displayMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear message input and focus input after that
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

function displayMessage(message){
    const div = document.createElement('div');

    if (message.id === sessionStorage.getItem('userID')) {
        div.classList.add("message", "from");
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">${message.text}</p>`;
    } else {
        div.classList.add("message", "to");
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">${message.text}</p>`;
    }
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to list name DOM
function outputUsers(users){
    userList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join('')}`;
}

// Press Enter to submit form
function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
        event.target.form.dispatchEvent(new Event("submit", { cancelable: true }));
        event.preventDefault();
    }
}
document.getElementById("msg").addEventListener("keypress", submitOnEnter);

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
});