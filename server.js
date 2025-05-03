const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "*"
    }
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import webhookRoutes with socket.io passed in
const webhookRoutes = require("./routes/webhooks")(io);
app.use((req, res, next) => {
    req.io = io;
    next();
  });
// Use Routes
app.use("/webhook", webhookRoutes); // Webhook routes using io
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);

// WebSocket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
