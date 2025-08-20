// socket.js
const socketIO = require("socket.io");

let io = null;

// Initialize Socket.IO with HTTP server
exports.init = (httpServer) => {
    io = socketIO(httpServer, {
        cors: {
            origin: "*", // Configure as needed for your frontend
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.on("disconnect", () => {});
    });

    return io;
};

// Get the Socket.IO instance
exports.getIO = () => {
    if (!io) {
        console.warn("Socket.IO not initialized yet");
        return null;
    }
    return io;
};
