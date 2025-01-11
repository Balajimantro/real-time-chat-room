const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200', // Angular's default development server
  }
});

app.use(cors());
app.use(express.json());

let totalOnlineUser = new Set()

io.on('connection', (socket) => {
  totalOnlineUser.add(socket.id);
  io.emit('totalOnlineUser', totalOnlineUser.size);
  socket.on('message', (data) => {
    io.emit('receiveMessage', data)
  })

  //   // Listen for typing events
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    totalOnlineUser.delete(socket.id);
    io.emit('totalOnlineUser', totalOnlineUser.size);
  });
})

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
