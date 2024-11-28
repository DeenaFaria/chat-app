const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Keep track of active rooms
const rooms = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send the list of active rooms to the client on connection
  socket.emit("room-list", Array.from(rooms));

  // Handle room joining
  socket.on("join-room", (room) => {
    socket.join(room);
    rooms.add(room); // Add the room to the set
    io.emit("room-list", Array.from(rooms)); // Update all clients with the room list
    console.log(`${socket.id} joined room: ${room}`);
  });

  // Handle messages
  socket.on("message", (data) => {
    io.to(data.room).emit("message", { nickname: data.nickname, message: data.message });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
