const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static("public"));

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  

  // Listen for chat messages
  socket.on("message", (data) => {
    io.emit("message", data); // Broadcast to all users
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
