const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const PORT = process.env.PORT || 5000;
const app = express();
const userMethods = require('./users');
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin:'http://localhost:3000',
  }
});
const router = require('./router');



io.on('connection', (socket) => {
  console.log('conexion nueva');

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = userMethods.addUser({ id:socket.id, name, room });
    if (error) return callback(error);

    socket.emit('message', { user:'admin', text:`${user.name} Bienvenido al canal ${user.room}`});
    socket.broadcast.to(user.room).emit('message',{ user: 'admin', text: `${user.name} se ha unido al canal`});
    socket.join(user.room);
    io.to(user.room).emit('roomData',{ room: user.room, users:userMethods.getUserInRoom(user.room)});



    callback();
  })

  socket.on('sendMessage', (message, callback) => {
    const user = userMethods.getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message})
    io.to(user.room).emit('roomData', { room: user.room, users:userMethods.getUserInRoom(user.room) })

    callback();
  });



  socket.on('disconnect', () => {
    console.log('usuario se ha ido ');
    const user = userMethods.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('message', {user:'admin', text:`${user.name} abandonó el canal`})
    }
  })
})



app.use(router);
server.listen(PORT, () => console.log(`Server en http://localhost:${PORT}`));