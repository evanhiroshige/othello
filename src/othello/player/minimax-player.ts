import {Player} from "./player";
import {Board} from "../board";
import {Move} from "../move";
import {PlayerColor} from "./player-color";

export class MinimaxPlayer implements Player {
    private opponentColor: PlayerColor;
    private count = 0;

    constructor(private color: PlayerColor, private depth: number, private evaluateState: (board: Board, color: PlayerColor, opponentColor: PlayerColor) => number) {
        this.opponentColor = this.color === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE;
    }

    getMove(board: Board): Promise<Move> {
        const m = this.minimax(board)
        return Promise.resolve(m);
    }

    minimax(board: Board): Move {
        const legalMoves = board.getLegalMoves(this.color);
        let maxScore = -Infinity
        let maxMove = undefined
        let alpha = -Infinity
        for (const move of legalMoves) {
            const successorBoard = board.copy()
            successorBoard.makeMove(move)
            const score = this.getMin(successorBoard, 1, alpha, Infinity)
            if (maxScore < score) {
                maxMove = move
                maxScore = score
            } else if (maxScore === score && Math.random() > 0.5) {
                maxMove = move
                maxScore = score
            }
            alpha = Math.max(alpha, score)
        }
        return maxMove
    }

    getMin(board: Board, depth: number, alpha: number, beta: number): number {
        if (board.isGameOver() || depth > this.depth) {
            return this.evaluateState(board, this.color, this.opponentColor);
        }
        const moves = board.getLegalMoves(this.opponentColor);

        if (moves.length === 0) {
            return this.evaluateState(board, this.color, this.opponentColor);
        }

        let minMoveScore = Infinity;
        for (const move of moves) {
            const successorBoard = board.copy();
            successorBoard.makeMove(move);
            const moveScore = this.getMax(successorBoard, depth + 1, alpha, beta);
            if (moveScore < alpha) {
                return moveScore
            }
            beta = Math.min(beta, moveScore);
            if (moveScore < minMoveScore) {
                minMoveScore = moveScore;
            }
        }
        return minMoveScore
    }

    getMax(board: Board, depth: number, alpha: number, beta: number): number {
        if (board.isGameOver() || depth > this.depth) {
            return this.evaluateState(board, this.color, this.opponentColor);
        }
        const moves = board.getLegalMoves(this.color);

        if (moves.length === 0) {
            return this.evaluateState(board, this.color, this.opponentColor);
        }

        let maxMove = -Infinity
        for (const move of moves) {
            const successorBoard = board.copy();
            successorBoard.makeMove(move);
            const moveScore = this.getMin(successorBoard, depth, alpha, beta);
            if (moveScore > beta) {
                return moveScore
            }
            alpha = Math.max(alpha, moveScore)
            if (maxMove < moveScore) {
                maxMove = moveScore;
            }
        }
        return maxMove;
    }
}