const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const http = require('http'); //http is used to create server beacuse socketio can use only http server instance only
const PORT = process.env.PORT || 5000; //This is the port on which server is running
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");
const app = express();
const server = http.createServer(app); //Creating http server using express instance
const io = socketio(server); //Socket IO will Run on this Server
app.use(cors());
//Difference between io() and socket(): socket() is used when sending message to all users expect the current socket user, io is used to send message to all the users in the room.

io.on('connection', function(socket){ //When is user try to connect through Front End, Backend Receives the information of the user as on 'socket' parameter to the function
    socket.on("join", function({name, room}, callback) { //Its the event callled from frontend and backend provide the functionality for that event.
        //The function contain the data send from backend and the callback function.
        // console.log(name, " ", room);
        const { error, user } = addUser({id: socket.id, name: name, room: room}); //addUser function can return either error or user so we destructure it as return arguments. 
        if(error){
            callback(error);
        }
        socket.emit("message", {user: "admin", text: `${user.name}, Welcome to the room ${user.room}!`});
        socket.broadcast.to(user.room).emit("message", {user: "admin", text: `${user.name} Joind the Room!`}) //Send Message to all user in the room except the Current User or the User that just joined.broadcast() method is use to broadcast the message to all users, to() is used to specify a specific room to broadcast the message, emit() takes command and the payload.
        socket.join(user.room); //Used so that user can join room.
        io.to(user.room).emit("allUsers", {users: getUsersInRoom(user.room)}); //Send All users which are currently in the room.
        callback();
    });
    socket.on("sendMessage", function(message, callback){ //Sending Message to the chatroom.
        const currentUser = getUser(socket.id); //Get Detail about current user using socketID
        io.to(currentUser.room).emit("message", {user: currentUser.name, text: message});  //to() is used to specify a specific room, text is the message send to users of the room
        callback();
    });
    socket.on('disconnect', function(){ //'socket' contain info about the user, so it's used to disconnect the user if the user wants to disconnect.
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message", {user: "admin", text: `${user.name} left the meeting!`});
            io.to(user.room).emit("allUsers", {users: getUsersInRoom(user.room)}); //Send All users which are currently in the room.
        }
    });
});

app.use(require('./router'));
server.listen(PORT, function(){
    console.log(`Server is running at PORT ${PORT}`);
});