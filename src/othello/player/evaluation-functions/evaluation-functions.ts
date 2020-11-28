import {Board} from "../../board";
import {PlayerColor} from "../player-color";
import Posn from "../../utility/posn";
import {Tile} from "../../tile";

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

export const testCount = (board: Board, color: PlayerColor) => {
    console.log(color + ", " + countStableEdges(board, color))
}

export const stableEdgeEvaluationFunction = (board: Board, color: PlayerColor, opponentColor: PlayerColor) => {
    return countStableEdges(board, color) - countStableEdges(board, opponentColor) + mobilityEvaluationFunction(board, color, opponentColor) / 100
}
const countStableEdges = (board: Board, color: PlayerColor) => {
    let stableEdges: Posn[] = undefined
    const filled = calculateFilledRows(board)
    let curStableEdges: Posn[] = []
    let count = 0
    while (JSON.stringify(stableEdges) !== JSON.stringify(curStableEdges)) {
        stableEdges = curStableEdges
        count++
        for (let row = 0; row < board.board.length; row++) {
            for (let col = 0; col < board.board[row].length; col++) {
                if (isStableEdge({row: row, column: col}, board, color, stableEdges, filled.filledRows, filled.filledCols, filled.filledDiags)) {
                    curStableEdges.push({row: row, column: col})
                }
            }
        }
    }
    return stableEdges.length
}

const calculateFilledRows = (board: Board) => {
    const filledRows = []
    const filledCols = []
    const filledDiags = []
    for (let row = 0; row < board.board.length; row++) {
        let rowFilled = true
        for (let col = 0; col < board.board[row].length; col++) {
            if (board.board[row][col] === Tile.UNOCCUPIED) {
                rowFilled = false
                break;
            }
        }
        if (rowFilled) {
            filledRows.push(row)
        }
    }
    for (let col = 0; col < board.board.length; col++) {
        let colFilled = true
        for (let row = 0; row < board.board.length; row++) {
            if (board.board[row][col] === Tile.UNOCCUPIED) {
                colFilled = false
                break;
            }
        }
        if (colFilled) {
            filledCols.push(col)
        }
    }

    const startPosnsForDiag: Posn[] = [
        {row: 7, column: 0},
        {row: 6, column: 0},
        {row: 5, column: 0},
        {row: 4, column: 0},
        {row: 3, column: 0},
        {row: 2, column: 0},
        {row: 1, column: 0},
        {row: 0, column: 0},
        {row: 0, column: 1},
        {row: 0, column: 2},
        {row: 0, column: 3},
        {row: 0, column: 4},
        {row: 0, column: 5},
        {row: 0, column: 6},
        {row: 0, column: 7}
    ]

    for (const start of startPosnsForDiag) {
        let curPosn = start
        let diagFilled = true
        while(board.isPosnOnBoard(curPosn)) {
            if (board.board[curPosn.row][curPosn.column] === Tile.UNOCCUPIED) {
                diagFilled = false
                break;
            }
            curPosn = {row: curPosn.row + 1, column: curPosn.column + 1}
        }
        if(diagFilled) {
            filledDiags.push(getDiagId(start))
        }
    }
    return {filledCols, filledRows, filledDiags}
}


const isStableEdge = (position: Posn, board: Board, color: PlayerColor, stableEdges: Posn[], filledRows: number[], filledCols: number[], filledDiags: number[]) => {
    const topLeftPosn = {row: position.row - 1, column: position.column - 1}
    const topPosn = {row: position.row - 1, column: position.column}
    const topRightPosn = {row: position.row - 1, column: position.column + 1}
    const rightPosn = {row: position.row , column: position.column + 1}
    const bottomRightPosn = {row: position.row + 1, column: position.column + 1}
    const bottomPosn = {row: position.row + 1, column: position.column}
    const bottomLeftPosn = {row: position.row + 1, column: position.column - 1}
    const leftPosn = {row: position.row, column: position.column - 1}
    let satisfiedConstraintCount = 0
    const tileColor = color === PlayerColor.WHITE ? Tile.WHITE : Tile.BLACK
    const inStableEdgeList = (pos: Posn) => stableEdges.filter(p => p.column === pos.column && p.row === pos.row).length === 1

    if (!board.isPosnOccupied(position) || board.board[position.row][position.column] !== tileColor) {
        return false
    }

    if (inStableEdgeList(position)) {
        return true
    }

    const isAdjacentToStableEdge = (pos: Posn) => board.board[pos.row][pos.column] === tileColor && inStableEdgeList(pos)

    // diag top left -> bottom right
    if (!board.isPosnOnBoard(topLeftPosn)
        || !board.isPosnOnBoard(bottomRightPosn)
        || filledDiags.includes(getDiagId(topLeftPosn))
        || isAdjacentToStableEdge(topLeftPosn)
        || isAdjacentToStableEdge(bottomRightPosn)) {
        satisfiedConstraintCount++
    }

    // col top -> bottom
    if (!board.isPosnOnBoard(topPosn)
        || !board.isPosnOnBoard(bottomPosn)
        || filledCols.includes(topPosn.column)
        || isAdjacentToStableEdge(topPosn)
        || isAdjacentToStableEdge(bottomPosn)) {
        satisfiedConstraintCount++
    }

    // diag top right -> bottom left
    if (!board.isPosnOnBoard(topRightPosn)
        || !board.isPosnOnBoard(bottomLeftPosn)
        || filledDiags.includes(getDiagId(topRightPosn))
        || isAdjacentToStableEdge(topRightPosn)
        || isAdjacentToStableEdge(bottomLeftPosn)) {
        satisfiedConstraintCount++
    }

    // row left -> right
    if (!board.isPosnOnBoard(leftPosn)
        || !board.isPosnOnBoard(rightPosn)
        || filledRows.includes(leftPosn.row)
        || isAdjacentToStableEdge(leftPosn)
        || isAdjacentToStableEdge(rightPosn)) {
        satisfiedConstraintCount++
    }
    return satisfiedConstraintCount === 4

}

const getDiagId = (posn: Posn) => {
    return posn.row - posn.column
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


