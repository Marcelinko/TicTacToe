export type User = {
	id: string;
	nickname: string;
};

export type Bot = User & {
	difficulty: string;
}

export type Game = {
	board: Board;
	currentPlayer: number;
};

export type Room = {
	id: string;
	owner: string;
	users: (User | Bot)[];
	game: Game;
}

export type Board = (null | 'X' | 'O')[][];