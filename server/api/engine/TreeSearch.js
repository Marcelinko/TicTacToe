import Node from './Node.js';
import GameState from './GameState.js';

export default class TreeSearch {
    constructor(rootState) {
        this.root = new Node(rootState);
    }

    search(iterations) {
        while (iterations-- > 0) {
            let node = this.select(this.root);
            let winner = this.rollout(node);
            this.backpropagation(node, winner);
        }
        return this.mostVisitedChild(this.root).move;
    }

    select(node) {
        while (!node.isTerminal()) {
            if (!node.isFullyExpanded()) {
                return this.expansion(node);
            } else {
                node = this.bestChild(node);
            }
        }
        return node;
    }

    expansion(node) {
        const moveIndex = Math.floor(Math.random() * node.untriedMoves.length);
        const move = node.untriedMoves.splice(moveIndex, 1)[0];
        const newState = node.state.applyMove(move);
        const childNode = new Node(newState);
        childNode.parent = node;
        childNode.move = move;
        node.children.push(childNode);
        return childNode;
    }

    rollout(node) {
        let stateCopy = new GameState(node.state.board, node.state.currentPlayer);
        while (!stateCopy.isGameOver()) {
            const move = this.rolloutPolicy(stateCopy);
            stateCopy = stateCopy.applyMove(move);
        }
        return stateCopy.getWinner();
    }

    rolloutPolicy(state) {
        const moves = state.getAvailableMoves();
        return moves[Math.floor(Math.random() * moves.length)];
    }

    backpropagation(node, result) {
        while (node !== null) {
            node.visits++;
            if (
                (node.state.currentPlayer === 1 && result === "X") ||
                (node.state.currentPlayer === 0 && result === "O")
            ) {
                node.value += 1;
            }
            if (
                (node.state.currentPlayer === 0 && result === "X") ||
                (node.state.currentPlayer === 1 && result === "O")
            ) {
                node.value -= 1;
            }
            node = node.parent;
        }
    }

    bestChild(node) {
        let bestScore = -Infinity;
        let bestChildren = [];
        for (const child of node.children) {
            const score = child.getUCB1();
            if (score > bestScore) {
                bestScore = score;
                bestChildren = [child];
            } else if (score === bestScore) {
                bestChildren.push(child);
            }
        }
        return bestChildren[Math.floor(Math.random() * bestChildren.length)];
    }

    mostVisitedChild(node) {
        let mostVisits = -Infinity;
        let mostVisitedChild = null;
        for (const child of node.children) {
            if (child.visits > mostVisits) {
                mostVisits = child.visits;
                mostVisitedChild = child;
            }
        }
        return mostVisitedChild;
    }
}