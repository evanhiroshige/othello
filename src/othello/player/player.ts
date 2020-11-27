import {Board} from "../board";
import {Move} from "../move";

export interface Player {
    getMove(board: Board): Promise<Move>
    isAiPlayer(): boolean
}
