import {Board} from "./board";
import {PlayerColor} from "./player/player-color";
import {Move} from "./move";

export default class OthelloController {
    board: Board
    currentPlayerColor: PlayerColor;

    constructor() {
        this.currentPlayerColor = PlayerColor.WHITE
        this.board = new Board()
    }

    public resetGame() {
        this.board = new Board()
    }

    executeTurn(move: Move) {
        this.board.makeMove(move)
        this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    }
    //
    // async executeTurn(player: PlayerColor) {
    //     if(player !== this.currentPlayerColor) {
    //         throw new Error("WRONG PLAYER MAKING MOVE")
    //     }
    //     const currentPlayer: Player = player === PlayerColor.WHITE ? this.white : this.black
    //     console.log(this.board.toStringWithMoves(this.currentPlayerColor))
    //     if (currentPlayer === this.white){
    //         this.whiteTurns++
    //     } else {
    //         this.blackTurns++
    //     }
    //     const move = await currentPlayer.getMove(this.board.copy())
    //     if (move) {
    //         this.board.makeMove(move)
    //     }
    //     this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    // }
}
