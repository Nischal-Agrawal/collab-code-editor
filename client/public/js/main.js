import { 
  connectSocket,
  joinRoom,
  sendCodeChange,
  receiveCodeChange,
  receiveUsers,
  sendCursor,
  receiveCursor
} from "./socket.js";

import {
  initEditor,
  onCodeChange,
  setCode,
  getCode,
  setLanguage,
  onCursorChange,
  showRemoteCursor
} from "./editor.js";

import {
  showEditorScreen,
  updateUserList
} from "./ui.js";

const joinBtn = document.getElementById("joinBtn");
const copyRoomBtn = document.getElementById("copyRoom");
const runBtn = document.getElementById("runCode");
const languageSelect = document.getElementById("language");

const params = new URLSearchParams(window.location.search);
const roomFromURL = params.get("room");

if (roomFromURL) {
  const roomInput = document.getElementById("roomId");
  if (roomInput) roomInput.value = roomFromURL;
}

let currentRoom = "";
let isRemoteUpdate = false;
let usernameGlobal = "";

joinBtn?.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const roomId = document.getElementById("roomId").value.trim();

  if (!username || !roomId) {
    alert("Please enter username and room ID");
    return;
  }

  usernameGlobal = username;
  currentRoom = roomId;

  connectSocket();
  joinRoom(roomId, username);

  showEditorScreen();
  initEditor();

  onCodeChange((code) => {
    if (!isRemoteUpdate) {
      sendCodeChange(currentRoom, code);
    }
  });

  receiveCodeChange((code) => {
    isRemoteUpdate = true;
    setCode(code);
    isRemoteUpdate = false;
  });

  receiveUsers((users) => {
    updateUserList(users);
  });

  onCursorChange((position) => {
    sendCursor(currentRoom, position, usernameGlobal);
  });

  receiveCursor(({ socketId, position, username }) => {
    showRemoteCursor(socketId, position, username);
  });
});

languageSelect?.addEventListener("change", () => {
  const lang = languageSelect.value;
  setLanguage(lang);
});

copyRoomBtn?.addEventListener("click", () => {
  if (!currentRoom) {
    alert("Join a room first!");
    return;
  }

  navigator.clipboard.writeText(currentRoom);
  alert("Room ID copied!");
});

runBtn?.addEventListener("click", () => {
  const code = getCode();

  try {
    let output = "";

    const originalLog = console.log;
    console.log = (msg) => {
      output += msg + "\n";
    };

    eval(code);

    console.log = originalLog;

    document.getElementById("output").innerText =
      output || "No output";

  } catch (err) {
    document.getElementById("output").innerText =
      "Error:\n" + err.message;
  }
});