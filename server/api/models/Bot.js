import User from './User.js';

export default class Bot extends User {
    constructor(difficulty) {
        super('bot', 'Bot');
        this.difficulty = difficulty;
    }
}
