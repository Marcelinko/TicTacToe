import {rooms} from "../utils/roomUtils.js";
import { applyMoveSchema, roomIdSchema } from "../utils/validationSchemas.js";
const tictactoeHandler = (io, socket) => {
    const applyMove = (data, cb) => {
        try {
            const {error} = applyMoveSchema.validate(data);
            if (error) {
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb("Room no longer exists");
                return;
            }
            const game = room.game;
            const user = room.getUserById(socket.id);
            if (!user) {
                cb("You are not in this room");
                return;
            }
            if (!room.isFull()) {
                cb("You need 2 players to play");
                return;
            }

            if(game.blockPlay){
                cb("Wait a moment");
                return;
            }

            if (game.currentPlayer !== room.users.indexOf(user)){
                cb("It's not your turn");
                return;
            }

            const wasMovePlayed = game.applyMove(data.move.row, data.move.col);
            if (!wasMovePlayed) {
                cb("Invalid move");
                return;
            }
            io.to(data.roomId).emit("tic-tac-toe:update", game.toJSON());
        } catch (e) {
            console.error(e);
        }
    }

    const newGame = (data, cb) => {
        try {
            const {error} = roomIdSchema.validate(data.roomId);
            if (error) {
                console.error(error);
                return;
            }
            const room = rooms[data.roomId];
            if (!room) {
                cb("Room no longer exists");
                return;
            }
            const game = room.game;
            game.newGame();
            io.to(data.roomId).emit("tic-tac-toe:update", game.toJSON());
        } catch (e) {
            console.error(e);
        }
    }

    socket.on("tic-tac-toe:applyMove", applyMove);
    socket.on("tic-tac-toe:newGame", newGame);
}

export default tictactoeHandler;