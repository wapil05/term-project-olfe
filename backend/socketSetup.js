const socketIO = require('socket.io');

function socketSetup(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    socket.on('userLoggedIn', (userData) => {
      io.emit('startScreenUpdate', { /* Daten für das Startbild hier */ });
    });
  });
}

module.exports = socketSetup;


