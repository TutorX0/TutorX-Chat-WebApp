const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
const webhookRoutes = require("./routes/webhooks");
const userRoutes = require("./routes/userRoutes");
const Chat = require("./models/chatModel");
const groupRoutes = require("./routes/groupRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors({ origin: true, credentials: true }));

app.use("/api/chat", chatRoutes);
app.use("/api", webhookRoutes);
app.use("/api", userRoutes);
app.use("/api/group", groupRoutes);
// Webhook verification endpoint

// Start your server
app.listen(3000, () => {
    console.log("Webhook server is running on port 3000");
});
