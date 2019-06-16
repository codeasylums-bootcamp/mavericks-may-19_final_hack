// const path = require('path');
// const http= require('http');
// const express = require('express');
// const socketIO= require('socket.io');
//
//
// const publicPath = path.join(__dirname, '../public');
// const port = process.env.PORT || 3000;
// var app = express();
// var server= http.Server(app);
// var io= socketIO(server);
// app.use(express.static(publicPath));
// io.on('connection',(socket)=>{
//   console.log('New User Connected');
//   socket.on('disconnect',()=>{
//     console.log('User was disconnected');
//   });
//
//   socket.on('createMessage', (message)=>{
//     console.log('createMessage', message);
//     io.emit('newMessage', {
//       from: message.from,
//       text: message.text,
//       createdAt: new Date().getTime()
//     });
//
//   });
// });
//
// server.listen(port, () => {
//   console.log(`Server is up on ${port}`);
// });
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString}= require('./utils/validation');
const {Users} =require('./utils/users.js');
const {generateMessage, generateLocationMessage}= require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 2900;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users= new Users();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


socket.on('join',(params, callback)=>{

if(!isRealString(params.name)|| !isRealString(params.room))
{
  return callback('Name and room name are required');
}
socket.join(params.room);
users.removeUser(socket.id);
users.addUser(socket.id, params.name, params.room);
//console.log(users.getUserList(params.room));
io.to(params.room).emit('updateUserList', users.getUserList(params.room) );
socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app') );

socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));

  callback();

});

  socket.on('createMessage', (message, callback) => {
    var user= users.getUser(socket.id);
    if(user&& isRealString(message.text))
    {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback('this is from server');

  });
socket.on('createLocationMessage',(locmessage)=>{
  var user= users.getUser(socket.id);
  if(user){
  io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,`${locmessage.latitude}, ${locmessage.longitude}`));}
});
  socket.on('disconnect', () => {
    var user= users.removeUser(socket.id);
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));

    console.log('User was disconnected');
  });
});
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
