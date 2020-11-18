import {Board} from "../../board";
import {PlayerColor} from "../player-color";

export const scoreEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {
    return board.getScore(color) - board.getScore(opponentColor);
}

export const mobilityEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {
    const playerMoves = board.getLegalMoves(color);
    const opponentMoves = board.getLegalMoves(opponentColor);
    if (playerMoves.length === 0) {
        return -200
    }
    return playerMoves.length - opponentMoves.length * 2
}

