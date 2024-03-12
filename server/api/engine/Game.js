import { EventEmitter } from "events";
import TreeSearch from "./TreeSearch.js";
import GameState from "./GameState.js";

export default class TicTacToe extends EventEmitter {
    constructor() {
        super();
        this.blockPlay = false;
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.players = [];
        this.currentPlayer = 0;
    }

    resetGame() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.currentPlayer = 0;
        this.emit("update", this.toJSON());
    }

    newGame() {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        this.currentPlayer = 0;
        if(this.players[this.currentPlayer].id === 'bot'){
            this.playMCTS();
        }
        this.emit("update", this.toJSON());
    }

    applyMove(row, col) {
        if (this.board[row][col] === null) {
            this.board[row][col] = this.currentPlayer === 0 ? "X" : "O";
            this.emit('move');
            const winner = this.checkWinner();
            if (winner) {
                this.emit("winner", winner);
                this.emit("update", this.toJSON());
                this.blockPlay = true;
                setTimeout(() => {
                    this.newGame();
                    this.blockPlay = false;
                }, 2500);
            } else {
                this.nextPlayer();
            }
            return true;
        }
        return false;
    }

    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        if(this.players[this.currentPlayer].id === 'bot'){
            setTimeout(() => {
                this.playMCTS();
                this.emit('update', this.toJSON());
            }, 500);
        }
    }

    checkWinner() {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2] && this.board[i][0] !== null) {
                return this.board[i][0];
            }
        }
        // Check columns
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i] && this.board[0][i] !== null) {
                return this.board[0][i];
            }
        }
        // Check diagonals
        if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== null) {
            return this.board[0][0];
        }
        if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== null) {
            return this.board[0][2];
        }
        // Check for draw
        let isBoardFull = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    isBoardFull = false;
                    break;
                }
            }
            if (!isBoardFull) {
                break;
            }
        }
        if (isBoardFull) {
            return 'Draw';
        }
        return null;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(socketId) {
        this.players = this.players.filter((player) => player.id !== socketId);
    }

    playMCTS() {
        const treeSearch = new TreeSearch(new GameState(this.board, this.currentPlayer));
        let difficulty = this.players[this.currentPlayer].difficulty;
        let iterations;
        switch (difficulty) {
            case "easy":
                iterations = 20;
                break;
            case "hard":
                iterations = 40;
                break;
            case "insane":
                iterations = 150;
                break;
            default:
                iterations = 25;
                break;
        }
        const bestMove = treeSearch.search(iterations);
        this.applyMove(bestMove[0], bestMove[1]);
    }

    toJSON() {
        return {
            board: this.board,
            players: this.players,
            currentPlayer: this.currentPlayer,
        };
    }
}