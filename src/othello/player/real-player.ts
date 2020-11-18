import {Player} from "./player";
import {PlayerColor} from "./player-color";
import {Board} from "../board";
import {Move} from "../move";
import {Tile} from "../tile";
import Posn from "../utility/posn";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


export class RealPlayer implements Player {
    private readonly color: PlayerColor;
    constructor(color: PlayerColor) {
        this.color = color
    }

    async getMove(board: Board): Promise<Move> {
        const moves = board.getLegalMoves(this.color)
        this.logMoves()
        if (moves.length !== 0) {
            const it = readline[Symbol.asyncIterator]();
            const index = await it.next();
            return moves[Number.parseInt(index.value)]
        } else {
            return undefined
        }

    }

    private logMoves() {
        const colorString = this.color === PlayerColor.WHITE ? "White" : " Black"
        console.log(`${colorString}: Input next move`)
    }
}