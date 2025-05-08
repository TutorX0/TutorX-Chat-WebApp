const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const path = require("path");
const http = require("http");
const socketModule = require("./socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with HTTP server
const io = socketModule.init(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import webhookRoutes with socket.io passed in
// const webhookRoutes = require("./routes/webhooks")(io);
// app.use((req, res, next) => {
//     req.io = io;
//     next();
//   });
// Use Routes
app.use("/webhook", whatsappRoutes); // Webhook routes using io
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);

// WebSocket logic
io.on("connection", (socket) => {
    socket.on("disconnect", () => {});
});

const { join } = require("path");
if (process.env.NODE_ENV === "production") {
    app.use(express.static(join(__dirname, "./view", "dist")));
    app.get("*", (req, res) => {
        res.sendFile(join(__dirname, "./view", "dist", "index.html"));
    });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
