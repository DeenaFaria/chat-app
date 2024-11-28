const socket = io();
const roomDropdown = document.getElementById("room-dropdown");
const newRoomInput = document.getElementById("new-room-input");
const joinRoomButton = document.getElementById("join-room-button");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const emojiPicker = document.getElementById("emoji-picker");
const emojiButton = document.getElementById("emoji-button");

let nickname = prompt("Enter your nickname:") || "Anonymous";
let currentRoom = null;

// Fetch and update room list
socket.on("room-list", (rooms) => {
  roomDropdown.innerHTML = '<option value="">-- Select a Room --</option>';
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomDropdown.appendChild(option);
  });
});

// Handle room joining
joinRoomButton.addEventListener("click", () => {
  const selectedRoom = roomDropdown.value;
  const newRoom = newRoomInput.value.trim();

  if (!selectedRoom && !newRoom) {
    alert("Please select or create a room!");
    return;
  }

  currentRoom = selectedRoom || newRoom;

  // Join the selected room
  socket.emit("join-room", currentRoom);

  // Hide room selection and show chat
  document.getElementById("room-selection-container").style.display = "none";
  chatContainer.style.display = "block";

  console.log(`Joined room: ${currentRoom}`);
});

// Handle sending messages
sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", { room: currentRoom, nickname, message });
    messageInput.value = "";
  }
});

// Display received messages
socket.on("message", (data) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-bubble");
  if (data.nickname === nickname) {
    messageElement.classList.add("own");
  }
  messageElement.innerHTML = `<strong>${data.nickname}:</strong> ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});

// Toggle emoji picker
emojiButton.addEventListener("click", () => {
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "block" : "none";
});

// Append emoji to input
emojiPicker.addEventListener("click", (e) => {
  if (e.target.classList.contains("emoji")) {
    messageInput.value += e.target.textContent;
    emojiPicker.style.display = "none";
  }
});
