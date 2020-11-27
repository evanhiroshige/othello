import {Player} from "./player";
import {PlayerColor} from "./player-color";
import {Board} from "../board";
import {Move} from "../move";

export class RandomPlayer implements Player {
    color: PlayerColor

    constructor(color: PlayerColor) {
        this.color = color
    }

    async getMove(board: Board): Promise<Move> {
        const moves = board.getLegalMoves(this.color)
        if (moves.length === 0) {
            return undefined
        }
        return  moves[Math.round(Math.random() * (moves.length - 1))]
    }

    isAiPlayer(): boolean {
        return true;
    }
}