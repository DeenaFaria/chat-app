const nicknameInput = prompt("Enter your nickname:");
let nickname = nicknameInput ? nicknameInput.trim() : "Anonymous";

const socket = io();
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", { nickname, message });
    messageInput.value = "";
  }
});

const emojiPicker = document.getElementById("emoji-picker");
const emojiButton = document.getElementById("emoji-button");


emojiButton.addEventListener("click", () => {
  emojiPicker.style.display =
    emojiPicker.style.display === "none" ? "block" : "none";
});

emojiPicker.addEventListener("click", (e) => {
  if (e.target.classList.contains("emoji")) {
    messageInput.value += e.target.textContent; // Append emoji to the input
    emojiPicker.style.display = "none";
  }
});


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

