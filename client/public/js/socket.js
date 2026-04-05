import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";


let socket;

// export function connectSocket() {
//   // socket = io("http://localhost:5000");
//   // socket = io("https://collab-code-editor-6k61.onrender.com/");
//   socket = io("https://collab-code-editor-6k61.onrender.com", {
//   transports: ["websocket"],
//   });
// }

export function connectSocket() {
  socket = io("https://collab-code-editor-6k61.onrender.com", {
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Connected to backend:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });
}

export function joinRoom(roomId, username) {
  socket.emit("join_room", { roomId, username });
}

export function sendCodeChange(roomId, code) {
  socket.emit("code_change", { roomId, code });
}

export function receiveCodeChange(callback) {
  socket.on("code_update", callback);
}

export function receiveUsers(callback) {
  socket.on("users_update", callback);
}

export function receiveNotification(callback) {
  socket.on("notification", callback);
}

export function sendCursor(roomId, position, username) {
  socket.emit("cursor_move", { roomId, position, username });
}

export function receiveCursor(callback) {
  socket.on("cursor_update", callback);
}

