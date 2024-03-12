export default class TicTacToeState {
    constructor(board, currentPlayer) {
        this.board = board;
        this.currentPlayer = currentPlayer;
    }
    isGameOver() {
        for (let i = 0; i < 3; i++) {
            if (
                this.board[i][0] &&
                this.board[i][0] === this.board[i][1] &&
                this.board[i][1] === this.board[i][2]
            ) {
                return true; // Row i is complete
            }
            if (
                this.board[0][i] &&
                this.board[0][i] === this.board[1][i] &&
                this.board[1][i] === this.board[2][i]
            ) {
                return true; // Column i is complete
            }
        }
        if (
            this.board[0][0] &&
            this.board[0][0] === this.board[1][1] &&
            this.board[1][1] === this.board[2][2]
        ) {
            return true; // Diagonal
        }
        if (
            this.board[0][2] &&
            this.board[0][2] === this.board[1][1] &&
            this.board[1][1] === this.board[2][0]
        ) {
            return true; // Diagonal
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!this.board[i][j]) {
                    return false; // Not a terminal state, game can continue
                }
            }
        }
        return true; // Tie game
    }

    applyMove(move) {
        const newBoard = this.board.map((row) => row.slice());
        newBoard[move[0]][move[1]] = this.currentPlayer === 0 ? "X" : "O";
        return new TicTacToeState(newBoard, this.currentPlayer === 0 ? 1 : 0);
    }

    getAvailableMoves() {
        const moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === null) {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    }
    getWinner(board = this.board) {
        // Check rows for a winner
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0] &&
                board[i][0] === board[i][1] &&
                board[i][1] === board[i][2]
            ) {
                return board[i][0]; // Return the winning player symbol
            }
        }

        // Check columns for a winner
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i] &&
                board[0][i] === board[1][i] &&
                board[1][i] === board[2][i]
            ) {
                return board[0][i]; // Return the winning player symbol
            }
        }

        // Check diagonals for a winner
        if (
            board[0][0] &&
            board[0][0] === board[1][1] &&
            board[1][1] === board[2][2]
        ) {
            return board[0][0]; // Return the winning player symbol
        }
        if (
            board[0][2] &&
            board[0][2] === board[1][1] &&
            board[1][1] === board[2][0]
        ) {
            return board[0][2]; // Return the winning player symbol
        }

        // If no winner is found, return null (indicating a tie or game in progress)
        return null;
    }
}
