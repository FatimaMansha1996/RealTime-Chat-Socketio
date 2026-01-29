const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 5000;
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for messages from the client
  socket.on("sendMessage", (data) => {
    console.log("Message received from client:", data);

    // Broadcast message to all connected clients
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
