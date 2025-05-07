// socket.js
const socketIO = require('socket.io');

let io = null;

// Initialize Socket.IO with HTTP server
exports.init = (httpServer) => {
  io = socketIO(httpServer, {
    cors: {
      origin: '*',  // Configure as needed for your frontend
      methods: ['GET', 'POST']
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
};

// Get the Socket.IO instance
exports.getIO = () => {
  if (!io) {
    console.warn('Socket.IO not initialized yet');
    return null;
  }
  return io;
};