import { Server } from "http";
import { Socket } from "socket.io";
import { MessageStorageService } from "./services/message-storage.service";
import { ServerUser, User, Message, MessageType } from "@ngx-webrtc/demo-video-chat-models";
import { UserStorageService } from "./services/user-storage.service";
import * as socketio from "socket.io";

let socketToUsers = new Map();
let socketToRoom = new Map();

const messageService: MessageStorageService = MessageStorageService.Instance();
const userService: UserStorageService = UserStorageService.Instance();

const getUserInRoom = (room: string): User[] => {
  const users: User[] = [];
  socketToRoom.forEach((value, key) => { 
    if (value === room) {
      if (socketToUsers.get(key)) {
        users.push({socketId: key, name: socketToUsers.get(key)});
      }
    }
  });
  return users;
}

export const initSockets = (http: Server) => {
  const options: Partial<socketio.ServerOptions>  = {};
  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    options.cors = {
      origin: 'http://localhost:4400'
    }
  }
  const io = new socketio.Server(http, options);

  // whenever a user connects
  io.on("connection", function (socket: Socket) {
    // console.log(`a user connected ${socket.id}`);


    socket.on('join', (data: {room}) =>  {
      socket.join(data.room);
      // io.to(data.room).emit('user joined', socketToUsers.get(socket.id));
      socketToRoom.set(socket.id, data.room);
      // io.to(socketToRoom.get(socket.id)).emit("userlist", getUserInRoom(data.room));
    });

    socket.on('joined', () =>  {
      const room = socketToRoom.get(socket.id);
      // io.to(socketToRoom.get(socket.id)).emit("userlist", getUserInRoom(room));
      io.emit("userJoinedRoom", getUserInRoom(room));
      io.emit("userlist", getUserInRoom(room));
    });

    socket.on('request-userlist', () => {
      const room = socketToRoom.get(socket.id);
      io.emit("userlist", getUserInRoom(room));
    });

    socket.on('leave', () =>  {
      
      const room = socketToRoom.get(socket.id);
      socketToRoom.delete(socket.id);

      io.to(room).emit('userLeftRoom', { id: socket.id, name: socketToUsers.get(socket.id)});
      io.to(room).emit("userlist", getUserInRoom(room));
    });

    socket.on("register", function (username: string) {
      if (!userService.usernameTaken(username)) {
        socketToUsers.set(socket.id, username);
        const user = userService.storeUser({socketId: socket.id, name: username});
        io.to(socket.id).emit('me', user);
        io.to(socketToRoom.get(socket.id)).emit("users", ...socketToUsers.values());
      } else {
        io.to(socket.id).emit('register-error', {code: 'USERNAME_TAKEN'});
      }
    });
    
    socket.on("refresh", function (user: ServerUser) {
      const refreshedUser = userService.updateUser(user.secret, socket.id);
      if (refreshedUser) {
        socketToUsers.set(socket.id, refreshedUser.name);
        io.to(socket.id).emit('me', refreshedUser);
        io.to(socketToRoom.get(socket.id)).emit("users", ...socketToUsers.values());
      } else {
        io.to(socket.id).emit('register-error', {code: 'TOKEN_ERROR'});
      }
    });

    // whenever we receive a 'message' we log it out
    socket.on("message", (clientMessage: {message: string, type: MessageType, for?: string}) =>  {
      if (Object.values(MessageType).includes(clientMessage.type)) {
        const message: Message = {
          message: clientMessage.message,
          author: socketToUsers.get(socket.id),
          time: Date.now(),
          type: clientMessage.type,
          room: socketToRoom.get(socket.id),
        };
        if (clientMessage.for) {
          message.for = clientMessage.for;
        }
        const storedMessage = messageService.storeMessage(message);
        // console.log(socketToRoom.get(socket.id));
        if (!storedMessage.for) {
          io.to(socketToRoom.get(socket.id)).emit("message", storedMessage);
        } else {
          const user = userService.findUserWithName(storedMessage.for);
          io.to(user?.socketId).emit("private-message", storedMessage);
        }
      }
    });

    socket.on("disconnect", function () {
      console.log("a user disconnected", socket.id);
      io.to(socketToRoom.get(socket.id)).emit("logout", socketToUsers.get(socket.id));
      io.to(socketToRoom.get(socket.id)).emit('userLeftRoom', { id: socket.id, name: socketToUsers.get(socket.id)});
      socketToUsers.delete(socket.id);
      socketToRoom.delete(socket.id);
    });

  });

  return io;
};
