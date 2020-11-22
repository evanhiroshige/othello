import {Board} from "./board";
import {Player} from "./player/player";
import {PlayerColor} from "./player/player-color";

export default class GameManager {
    white: Player
    black: Player
    board: Board
    currentPlayerColor: PlayerColor = PlayerColor.WHITE
    whiteTurns: number = 0
    blackTurns: number = 0

    constructor(white: Player, black: Player) {
        this.white = white
        this.black = black
        this.board = new Board()
    }

    public resetGame() {
        this.board = new Board()
    }

    getCurrentPlayerTurn() {
        return this.currentPlayerColor;
    }

    async executeTurn(player: PlayerColor) {
        if(player !== this.currentPlayerColor) {
            throw new Error("WRONG PLAYER MAKING MOVE")
        }
        const currentPlayer: Player = player === PlayerColor.WHITE ? this.white : this.black
        console.log(this.board.toStringWithMoves(this.currentPlayerColor))
        if (currentPlayer === this.white){
            this.whiteTurns++
        } else {
            this.blackTurns++
        }
        const move = await currentPlayer.getMove(this.board.copy())
        if (move) {
            this.board.makeMove(move)
        }
        this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    }
}
