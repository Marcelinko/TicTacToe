import {rooms} from "../utils/roomUtils.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Bot from "../models/Bot.js";
import { createRoomSchema, joinRoomSchema, removeUserSchema, roomIdSchema, addBotSchema } from "../utils/validationSchemas.js";

const roomHandler = (io, socket) => {
    const createRoom = (data, cb) => {
        try {
            const { error } = createRoomSchema.validate(data);
            if (error) {
                return;
            }
            const user = new User(socket.id, data.nickname);
            const room = new Room(socket.id);
            const game = room.game;
            rooms[room.id] = room;
            game.on('update', (gameState) => {
                io.to(room.id).emit("tic-tac-toe:update", gameState);
            });
            game.on('winner', (winner) => {
                io.to(room.id).emit("tic-tac-toe:winner", winner);
            });
            game.on('move',() => {
                io.to(room.id).emit("tic-tac-toe:move");
            });
            room.addUser(user);
            socket.join(room.id);
            cb(room.toJSON());
        } catch (e) {
            console.error(e);
        }
    };

    const joinRoom = (data, cb) => {
        try {
            const { error } = joinRoomSchema.validate(data);
            if (error) {
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb(undefined, "This room no longer exists");
                return;
            }
            if(room.isFull()){
                cb(undefined, "Room is full");
                return;
            }
            const user = new User(socket.id, data.nickname);
            room.addUser(user);
            socket.join(data.roomId);
            socket.broadcast.to(data.roomId).emit("room:update", room.toJSON());
            cb(room.toJSON());
        } catch (e) {
            console.error(e);
        }
    };

    const removeUser = (data,cb) => {
        try {
            const { error } = removeUserSchema.validate(data);
            if (error) {
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb("This room no longer exists");
                return;
            }
            if (room.owner !== socket.id) {
                return;
            }
            const user = room.getUserById(data.userId);
            if (!user) {
                cb("User is not in this room");
                return;
            }
            if(user.id === room.owner){
                return;
            }
            room.removeUser(data.userId);
            if(user.id !== 'bot'){
                io.to(data.userId).emit("room:kicked");
            }
            io.to(data.roomId).emit("room:update", room.toJSON());
            if(user.id !== 'bot'){
                const socket = io.sockets.sockets.get(data.userId);
                if (socket) {
                    socket.leave(data.roomId);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const addBot = (data,cb) => {
        try {
            const { error } = addBotSchema.validate(data);
            if (error) {
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb("This room no longer exists");
                return;
            }
            if (room.owner !== socket.id) {
                return;
            }
            if(room.isFull()){
                return;
            }
            const bot = new Bot(data.difficulty);
            room.addBot(bot);
            io.to(data.roomId).emit("room:update", room.toJSON());
        } catch (e) {
            console.error(e);
        }
    }
    const swapPlaces = (data, cb) => {
        try{
            const { error } = roomIdSchema.validate(data.roomId);
            if (error) {
                console.error(error);
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb("This room no longer exists")
                return;
            }
            if (room.owner !== socket.id) {
                return;
            }
            if(!room.isFull()){
                return;
            }
            room.swapPlaces();
            const game = room.game;
            if(game.players[game.currentPlayer].id === 'bot'){
                game.playMCTS();
                io.to(data.roomId).emit("tic-tac-toe:update", game.toJSON());
            }
            io.to(data.roomId).emit("room:update", room.toJSON());
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleLeaveRoom = (room) => {
        const users = room.users.filter((user) => user.id !== 'bot');
        if (users.length === 0) {
            room.game.removeAllListeners();
            delete rooms[room.id];
        } else {
            if (room.owner === socket.id) {
                room.owner = room.users[0].id;
            }
            io.to(room.id).emit("room:update", room.toJSON());
        }
    }

    const leaveRoom = (data) => {
        try {
            const room = rooms[data.roomId];
            if (!room) {
                return;
            }
            const user = room.getUserById(socket.id);
            if (!user) {
                return;
            }
            room.removeUser(socket.id);
            handleLeaveRoom(room);
            socket.leave(data.roomId);
        } catch (e) {
            console.error(e);
        }
    };

    const onDisconnect = () => {
        for (const roomId in rooms) {
            const room = rooms[roomId];
            if (room.getUserById(socket.id)) {
                room.removeUser(socket.id);
                handleLeaveRoom(room);
            }
        }
    };

    socket.on("room:create", createRoom);
    socket.on("room:join", joinRoom);
    socket.on("room:removeUser", removeUser);
    socket.on("room:addBot", addBot);
    socket.on("room:swapPlaces", swapPlaces);
    socket.on("room:leave", leaveRoom);
    socket.on("disconnect", onDisconnect);
}

export default roomHandler;