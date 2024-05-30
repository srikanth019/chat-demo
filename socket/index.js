const http = require("http");
const { Server } = require("socket.io");
const { generateRandomId } = require("../utils");

exports.ioServer = (app, sessionMiddleware) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });
  const allRooms = (app.locals.chatRooms = []);

  // Share session middleware with socket.io
  // io.use((socket, next) => {
  //   sessionMiddleware(socket.request, socket.request.res || {}, next);
  // });
  io.engine.use(sessionMiddleware);

  io.of("/roomList").on("connection", (socket) => {
    console.log("New client connected", socket.id);
    socket.on("getChatRooms", () => {
      socket.emit("chatRoomList", JSON.stringify(allRooms));
    });

    socket.on("createChatRoom", (roomName, callback) => {
      if (!roomName) {
        return callback("Please enter a room name");
      }
      //check if room is already exit in allRooms using roomName
      const existingRoom = allRooms.find(
        (room) =>
          room.roomName.trim().toLowerCase() === roomName.trim().toLowerCase()
      );
      if (existingRoom) {
        return callback("Room already exists");
      }

      const newRoom = {
        roomName: roomName,
        roomId: generateRandomId(),
        roomUsers: [],
      };
      allRooms.push(newRoom);
      //Emit event to the updated room to the creator
      socket.emit("chatRoomList", JSON.stringify(allRooms));
      //Emit event to everyone connected to the page
      socket.broadcast.emit("chatRoomList", JSON.stringify(allRooms));
      callback();
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  io.of("/chatter").on("connection", (socket) => {
    console.log("Chat room Client connected", socket.id);
    socket.on("join", (data, callback) => {
      //check of the is exist using allRooms and data.roomId
      const room = allRooms.find((room) => room.roomId === data.roomId);
      if (!room) {
        return callback("Chat room not found");
      }
      //Get the active user from the session
      const userId = socket.request.session.passport.user;
      //check the if user is exist in room.roomUsers list
      const existingUser = room.roomUsers.findIndex(
        (user) => user.userId === userId
      );
      if (existingUser > -1) {
        //remove the user from the room users
        room.roomUsers.splice(existingUser, 1);
      }

      //Push the user into the room.roomUsers list
      room.roomUsers.push({
        socketId: socket.id,
        userId,
        userName: data.userName,
        userPic: data.userPic,
      });

      socket.join(data.roomId);

      //Update the list of active users on chat room page
      console.log(/updated room/, room);
      // socket.to(data.roomId).broadcast.emit("userJoined", data.username);
      // socket.to(data.roomId).emit("userJoined", data.username);
      callback();
    });
  });

  return server;
};
