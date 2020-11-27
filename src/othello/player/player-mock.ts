import {Player} from "./player";
import {PlayerColor} from "./player-color";
import {Board} from "../board";
import {Move} from "../move";


export class PlayerMock implements Player {
    constructor() {
    }

    async getMove(board: Board): Promise<Move> {
            return undefined
    }

    isAiPlayer(): boolean {
        return false;
    }
}