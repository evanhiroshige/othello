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

    constructor(white: Player, black: Player, private onTurnCallback: () => void = undefined) {
        this.white = white
        this.black = black
        this.board = new Board()
    }

    public resetGame() {
        this.board = new Board()
    }

    public async startGame() {
        this.whiteTurns = 0
        this.blackTurns = 0
        while (!this.board.isGameOver()) {
            console.log(this.board.toString())
            await this.executeTurn()
        }
        console.log(this.board.toString())
        console.log("WHITE: " + this.board.getScore(PlayerColor.WHITE))
        console.log("BLACK: " + this.board.getScore(PlayerColor.BLACK))
    }

    public isAITurn(): boolean {
        const player = this.currentPlayerColor === PlayerColor.WHITE ? this.white : this.black
        return player.isAiPlayer()
    }


    async executeTurn() {
        const currentPlayer: Player = this.currentPlayerColor === PlayerColor.WHITE ? this.white : this.black
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
