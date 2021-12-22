//This file contain all the helper function for the user functionality
const users = []; //Array of User to Store user Detail.

function addUser({id, name, room}){ //Add a New user to a Room which is provided from frontend as a parameter. 
    //The Parameter are 1st id which the userID or to be more specific socket id from frontend, 2nd name of the user, and 3rd room name.
    name = name.trim().toLowerCase(); //Remove Spaces Between and convert to lower case string. Eg: "Hello World" -> trim() => "HelloWorld" -> toLowerCase() => "helloworld";
    room = room.trim().toLowerCase(); //Remove Spaces Between and convert to lower case string. Eg: "Hello World" -> trim() => "HelloWorld" -> toLowerCase() => "helloworld";
    const checkExistingUser = users.find((user) => user.room === room && user.name === name); //Check and return True if the user exists in the same room and with same name else false is returned and is stored in the checkExistingUser variable. "user" is the user object from the array of the users and it features name and room is checked against the data send from the frontend.
    if(checkExistingUser){
        return {error: "User name already taken!"};
    }
    const newUser = {id: id, name: name, room: room}; //New User created
    users.push(newUser); //New user pushed to the users array
    return {user: newUser}; 
}

function removeUser(id){ //User removed with the help to socket ID.
    const index = users.findIndex((user) => user.id === id); //Finding the index of array element which contain the userId same as socket id from the frontend.
    if(index != -1){
        return users.splice(index, 1)[0]; //splice is used to remove element from array. 1st parameter is the startin index and 2nd parameter is number of element to be deleted. splice return array of all the removed element.
    }
}

function getUser(id){ //Get detail of user of specific Socket ID
    return users.find((user) => user.id === id);
}

function getUsersInRoom(room){ //Get Data of All User in a specific room
    return users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom };