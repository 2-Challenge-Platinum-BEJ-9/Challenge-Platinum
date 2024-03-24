require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");

const router = require("./router/index");
const passport = require("./middleware/passport");
const { logger } = require("./helper/logger");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(morgan("short"));
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  let message = "Welcome to Bingleshop!";
  res.json({ message });
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  logger.error(err.message);
  return res.status(500).json({ message: err.message });
});

let adminId = "";

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");

  if (socket.handshake.query.is_admin) {
    adminId = socket.id;
  }

  socket.on("send chat", (data) => {
    const { user_id, message } = data;
    if (socket.handshake.query.is_admin) {
      io.to(user_id).emit("receive chat", { message });
    } else {
      io.to(adminId).emit("receive chat", {
        user_id: socket.id,
        message: message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = httpServer;
