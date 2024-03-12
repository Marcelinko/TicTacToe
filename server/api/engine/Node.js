export default class Node {
    constructor(state) {
        this.state = state;
        this.children = [];
        this.parent = null;
        this.visits = 0;
        this.value = 0;
        this.move = null;
        this.untriedMoves = state.getAvailableMoves();
    }

    isFullyExpanded() {
        return this.untriedMoves.length === 0;
    }
    isTerminal() {
        return this.state.isGameOver();
    }
    getUCB1(){
        let exploitation = this.value / this.visits;
        let exploration = Math.sqrt(2 * Math.log(this.parent.visits) / this.visits);
        return exploitation + exploration;
    }
}