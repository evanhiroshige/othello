import React from "react";
import "./tile-view.css"
import BoardView from "./board-view";
import {Board} from "../othello/board";
import {MinimaxPlayer} from "../othello/player/minimax-player";
import {PlayerColor} from "../othello/player/player-color";
import {mobilityEvaluationFunction} from "../othello/player/evaluation-functions/evaluation-functions";
import OthelloController from "../othello/othello-controller";
import {Move} from "../othello/move";
import {Player} from "../othello/player/player";
import {Tile} from "../othello/tile";
import {PlayerMock} from "../othello/player/player-mock";
import "./game-manager-view.css"
import {Button} from "@material-ui/core";

interface GameManagerProps {
}

interface GameManagerState {
    board: Board,
    curTurn: PlayerColor
}

class GameManagerView extends React.Component<GameManagerProps, GameManagerState> {
    private readonly manager: OthelloController
    private readonly opponent: Player
    state: GameManagerState = {
        curTurn: PlayerColor.WHITE,
        board: undefined
    }

    constructor(props: GameManagerProps) {
        super(props);
        this.opponent = new MinimaxPlayer(PlayerColor.BLACK, 3, mobilityEvaluationFunction)
        this.manager = new OthelloController(new PlayerMock(), this.opponent)
        this.state.board = this.manager.board
    }

    async componentDidUpdate(prevProps: Readonly<GameManagerProps>, prevState: Readonly<GameManagerState>, snapshot?: any) {
        if (!this.manager.board.isGameOver() && this.manager.isAiTurn()) {
            await new Promise(resolve => {
                setTimeout(resolve, 100)
            })

            const move = await this.opponent.getMove(this.manager.board.copy())
            this.manager.executeTurn(move);
            this.pass()
        }
    }

    async makeMove(row: number, col: number) {
        const move: Move = {
            tile: this.state.curTurn === PlayerColor.WHITE ? Tile.WHITE : Tile.BLACK,
            position: {row, column: col}
        }

        this.manager.executeTurn(move)
        this.pass()

        if (this.manager.board.isGameOver()) {
            return;
        }
    }

    pass() {
        this.setState({board: this.manager.board,
            curTurn: this.state.curTurn === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE })
    }

    async skipTurn() {
        if (this.manager.board.isGameOver()) {
            return;
        }
        this.manager.skipCurrentTurn()
        this.pass()
    }


    renderTitle() {
        return <div className={"title"}>Othello</div>

    }

    renderTurnState() {
        let turn = this.state.curTurn === PlayerColor.WHITE ? "White's turn" : "Black's Turn"
        if (this.manager.board.isGameOver()) {
            turn = "Game Over"
        }
        return <div className={"turn"}>{turn}</div>
    }


    renderScore() {
        const score = "White: " + this.manager.board.getScore(PlayerColor.WHITE)
            + "   Black: " + this.manager.board.getScore(PlayerColor.BLACK)
        return <div className={"score"}>{score}</div>
    }

    renderResetGame() {

        return <Button className="reset" variant="contained" color="primary" onClick={() => {
            this.manager.resetGame()
            this.setState({board: this.manager.board,
                curTurn: this.manager.currentPlayerColor })
        }}>
            Play Again
        </Button>
    }


    render() {
        const moves = this.state.board.getLegalMoves(this.state.curTurn)
        return (
            <div>
                {this.renderTitle()}
                {this.renderScore()}
                {this.renderTurnState()}

                <BoardView board={this.state.board}
                           boardMoves={moves}
                           getMove={this.makeMove.bind(this)}
                           pass={this.skipTurn.bind(this)}
                 />
                {this.manager.board.isGameOver() &&
                    this.renderResetGame()}

            </div>
        );
    }
}

export default GameManagerView