import {Board} from "./board";
import {PlayerColor} from "./player/player-color";
import {Move} from "./move";
import {Player} from "./player/player";
import {runTest} from "./test-evaluation-functions";

export default class OthelloController {
    board: Board
    currentPlayerColor: PlayerColor;

    constructor(private white: Player, private black: Player) {
        this.currentPlayerColor = PlayerColor.WHITE
        this.board = new Board()
    }

    public resetGame() {
        this.currentPlayerColor = PlayerColor.WHITE
        this.board = new Board()
    }

    public isAiTurn() {
        const player = this.currentPlayerColor === PlayerColor.WHITE ? this.white : this.black
        return player.isAiPlayer()
    }

    executeTurn(move: Move) {
        this.board.makeMove(move)
        this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    }

    skipCurrentTurn() {
        this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    }
}
