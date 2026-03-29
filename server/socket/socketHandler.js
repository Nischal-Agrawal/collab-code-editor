const {
  addUser,
  removeUser,
  updateCode,
  getUsers,
  getCode
} = require("../services/roomService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", ({ roomId, username }) => {
      socket.join(roomId);

      addUser(roomId, {
        username,
        socketId: socket.id
      });

      socket.to(roomId).emit("notification", `${username} joined`);

      socket.emit("code_update", getCode(roomId));

      io.to(roomId).emit("users_update", getUsers(roomId));
    });

    socket.on("code_change", ({ roomId, code }) => {
      updateCode(roomId, code);

      socket.to(roomId).emit("code_update", code);
    });

    socket.on("cursor_move", ({ roomId, position, username }) => {
      socket.to(roomId).emit("cursor_update", {
        socketId: socket.id,
        position,
        username
      });
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        const { roomId, username } = user;

        socket.to(roomId).emit("notification", `${username} left`);

        io.to(roomId).emit("users_update", getUsers(roomId));
      }

      console.log("User disconnected:", socket.id);
    });
  });
};