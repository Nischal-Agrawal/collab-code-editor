const rooms = require("../models/roomModel");

function createRoom(roomId) {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      users: [],
      code: ""
    };
  }
}

function addUser(roomId, user) {
  createRoom(roomId);
  rooms[roomId].users.push(user);
}

function removeUser(socketId) {
  for (let roomId in rooms) {
    rooms[roomId].users = rooms[roomId].users.filter(
      (user) => user.socketId !== socketId
    );
  }
}

function updateCode(roomId, code) {
  if (rooms[roomId]) {
    rooms[roomId].code = code;
  }
}

function getUsers(roomId) {
  return rooms[roomId]?.users || [];
}

function getCode(roomId) {
  return rooms[roomId]?.code || "";
}

module.exports = {
  createRoom,
  addUser,
  removeUser,
  updateCode,
  getUsers,
  getCode
};