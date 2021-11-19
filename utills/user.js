const users = [];

// User join to chat room
function userJoin(id, username, room){
    const user = {id, username, room};
    users.push(user);

    return user;
}

// Get infor current user
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// User leaves chat room
function userLeaveChat(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// Get users in same room
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaveChat,
    getRoomUsers
};