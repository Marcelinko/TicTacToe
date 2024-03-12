import { v4 as uuidv4 } from 'uuid';
import TicTacToe from '../engine/Game.js';
import Player from './Player.js';
import BotPlayer from './BotPlayer.js';
export default class Room {
    constructor(owner){
        this.id = uuidv4();
        this.owner = owner;
        this.users = [];
        this.game = new TicTacToe();
    }

    addUser = (user) => {
        this.users.push(user);
        this.game.addPlayer(new Player(user.id));
        this.game.currentPlayer = 0;
    }

    addBot = (bot) => {
        this.users.push(bot);
        this.game.addPlayer(new BotPlayer(bot.id, bot.difficulty));
        this.game.currentPlayer = 0;
    }

    removeUser = (socketId) => {
        this.game.resetGame();
        this.game.removePlayer(socketId);
        this.users = this.users.filter((user) => user.id !== socketId);
    }
    swapPlaces = () => {
        this.game.resetGame();
        const user1 = this.users[0];
        this.users[0] = this.users[1];
        this.users[1] = user1;
        this.game.players = this.users.map((user) => new Player(user.id));
    }
    getUserById = (socketId) => {
        return this.users.find((user) => user.id === socketId);
    }

    isFull = () => {
        return this.users.length >= 2;
    }

    toJSON = () => {
        return {
            id: this.id,
            owner: this.owner,
            users: this.users,
            game: this.game.toJSON()
        };
    }
}