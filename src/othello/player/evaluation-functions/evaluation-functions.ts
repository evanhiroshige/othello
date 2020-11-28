import {Board} from "../../board";
import {PlayerColor} from "../player-color";
import Posn from "../../utility/posn";

export const scoreEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {
    return board.getScore(color) - board.getScore(opponentColor);
}

const cornerPosns: Posn[] = [{row: 0, column: 0}, {row: 0, column: 7},  {row: 7, column: 0},  {row: 7, column: 7}]
export const mobilityEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {
    const playerMoves = board.getLegalMoves(color);
    const opponentMoves = board.getLegalMoves(opponentColor);
    if (playerMoves.length === 0) {
        return -200
    }

    const whiteTileCount = countCorners(Array.from(board.whiteTiles)) * (color === PlayerColor.WHITE ? 5 : -15)
    const blackTilesCount = countCorners(Array.from(board.blackTiles)) * (color === PlayerColor.BLACK ? 5 : -15)
    return playerMoves.length - opponentMoves.length + whiteTileCount + blackTilesCount
}

export const stableEdgeEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {

}

const countStableEdges = (board: Board, color: PlayerColor) => {
    const tiles = color === PlayerColor.WHITE ? board.whiteTiles : board.blackTiles
    const positions = Array.from(tiles)
    const corners = []
    positions.map(position => {
        for (const corner of cornerPosns) {
            if (position.row === corner.row && position.column === corner.column) {
                corners.push(position)
            }
        }
    })

}

const countStableEdgesFromCorner = (board: Board, corner: Posn, color:PlayerColor, seen: []) => {
}

const countCorners = (positions: Posn[]): number => {
    let count = 0
    positions.map(position => {
        for (const corner of cornerPosns) {
            if (position.row === corner.row && position.column === corner.column) {
                count++
            }
        }
    })
    return count
}


