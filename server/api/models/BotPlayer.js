import Player from './Player.js';
export default class BotPlayer extends Player {
    constructor(id, difficulty){
        super(id);
        this.difficulty = difficulty;
    }
}
