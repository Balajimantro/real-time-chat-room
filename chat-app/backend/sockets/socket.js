let totalOnlineUser = new Set();

function socketMethods(io) {
  io.on('connection', (socket) => {

    // Add the new user to the set
    totalOnlineUser.add(socket.id);

    // Emit the total number of online users
    io.emit('totalOnlineUser', totalOnlineUser.size);

    // Listen for messages and broadcast to all clients
    socket.on('message', (data) => {
      io.emit('receiveMessage', data);
    });

    // Listen for typing events and broadcast to all except the sender
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {

      // Remove the user from the set
      totalOnlineUser.delete(socket.id);

      // Emit the updated total number of online users
      io.emit('totalOnlineUser', totalOnlineUser.size);
    });
  });
}

module.exports = { socketMethods };