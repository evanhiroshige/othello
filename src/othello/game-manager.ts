import {Board} from "./board";
import {Player} from "./player/player";
import {PlayerColor} from "./player/player-color";

export default class GameManager {
    white: Player
    black: Player
    board: Board
    currentPlayerColor: PlayerColor = PlayerColor.WHITE


    constructor(white: Player, black: Player, private onTurnCallback: () => void = undefined) {
        this.white = white
        this.black = black
        this.board = new Board()
    }

    public async startGame() {
        await new Promise(resolve => {
            setTimeout(resolve, 2000)
        })
        while (!this.board.isGameOver()) {
            await this.executeTurn()
            this.onTurnCallback()
            await new Promise(resolve => {
                setTimeout(resolve, 2000)
            })

        }
        const whiteScore = this.board.getScore(PlayerColor.WHITE)
        const blackScore = this.board.getScore(PlayerColor.BLACK)
        const winner = whiteScore > blackScore ? "White" : "Black"
        // console.log(this.board.toString())
        // console.log(`White: ${whiteScore}`)
        // console.log(`Black: ${blackScore}`)
        // console.log(`${winner} wins!`)
    }

    async executeTurn() {
        const currentPlayer: Player = this.currentPlayerColor === PlayerColor.WHITE ? this.white : this.black
        // console.log(this.board.toStringWithMoves(this.currentPlayerColor))

        const move = await currentPlayer.getMove(this.board.copy())
        if (move) {
            this.board.makeMove(move)
        } else {
            // console.log("Player Skipped\n")
        }
        this.currentPlayerColor = this.currentPlayerColor === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE
    }
}
