
const express = require("express");

const app = express();
//creamos un servidor http
const http = require("http").Server(app);
//socket io
const io = require("socket.io")(http);
var path = require('path');
var users = {};
//routes

app.use(require("./routes/stream.routes"));

// html files

app.use(express.static(__dirname+"/public"));

// arrays to count number of users and likes
let arrayUser =[]
let likesUsers = []

io.on("connection", (socket)=>{

// objects
users[socket.id] = {numerUsers: 0};
let user ={
    nickname : '',
}
arrayUser.push(user);
let streaming ={
    title:'',
}
//to calculate current time
let time ={
    now(){
        newDate = new Date();
        let hour= ''+newDate.getHours()+':'+newDate.getMinutes()
            return hour;
    }
}
/** event to calculate numbers of users
 * @param numerUsers
 */
socket.on("numerOfUsers", (numerUsers)=>{
   numerUsers = arrayUser.length;
    io.emit("numerOfUsers",numerUsers);
})
/**event to iniciate image to stream
 * @param image
 *  */ 
socket.on("stream", (image)=>{

socket.broadcast.emit("stream", image);

})
// stop stream
socket.on("stopStream",(video)=>{

    socket.broadcast.emit("stopStream");

})
    
/**event to send messages of users to the chat, this include nickname, time, and message
 * @param msg
 * @param nickname
 */
socket.on("chat",(msg, nickname, )=>{
    user.nickname =  nickname;
      
    io.emit("chat", time.now() ,user.nickname , msg)
})

/**
 * It inform to viewers the streaming start   
 * @param startStreamMsg
 *  */ 
socket.on("startStream",(startStreamMsg)=>{

    io.emit("startStream",startStreamMsg +=" está emitiendo en directo");
})

/**send to viewers the title of stream
 * @param streamingTitle
 */
socket.on("streamTitle",(streamingTitle)=>{
        io.emit("streamTitle",streamingTitle);
})

let numLikes = 0
/**
 * it count the number of likes that the viewer's give
 * @param  likes
 */
socket.on("numbersOfLikes", (likes)=>{
        if(numLikes == 0 ){
            likesUsers.push(streaming)
            numLikes = 1;
}
        
likes = likesUsers.length      
io.emit("numbersOfLikes", likes);
   
})
    
 //this event is active when someone left the stream
socket.on('disconnect', function () {
        arrayUser.pop();
        
        numerUsers = arrayUser.length;
        /**update the number of users when someone left the streaming
         * @param numerUsers
         */
        io.emit("oneUserDisconnect",numerUsers);
   
    })
    
})


module.exports = http;

//////////////////////////////////////////////////////////////

