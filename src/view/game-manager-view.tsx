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

interface GameManagerProps {
}

interface GameManagerState {
    board: Board,
    curTurn: PlayerColor
}

class GameManagerView extends React.Component<GameManagerProps, GameManagerState> {
    private readonly manager: OthelloController
    private opponent: Player
    state: GameManagerState = {
        curTurn: PlayerColor.WHITE,
        board: undefined
    }

    constructor(props: GameManagerProps) {
        super(props);
        // const w = new MinimaxPlayer(PlayerColor.WHITE, 2, mobilityEvaluationFunction)
        this.manager = new OthelloController()
        this.opponent = new MinimaxPlayer(PlayerColor.BLACK, 3, mobilityEvaluationFunction)
        this.state.board = this.manager.board
    }

    renderScore() {
        const score = "White: " + this.manager.board.getScore(PlayerColor.WHITE)
            + "   Black: " + this.manager.board.getScore(PlayerColor.BLACK)
        return <div>{score}</div>
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
        await new Promise(resolve => {
            setTimeout(resolve, 500)
        })
        this.opponent.getMove(this.manager.board.copy()).then(move => {
            this.manager.executeTurn(move);
            this.pass()
        })

    }
    pass() {
        this.setState({board: this.manager.board,
            curTurn: this.state.curTurn === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE })
    }

    async skipTurn() {
        if (this.manager.board.isGameOver()) {
            return;
        }
        this.pass()
        await new Promise(resolve => {
            setTimeout(resolve, 500)
        })

        this.opponent.getMove(this.manager.board.copy()).then(move => {
            this.manager.executeTurn(move);
            this.pass()
        })
    }


    render() {
        const moves = this.state.board.getLegalMoves(this.state.curTurn)
        return (
            <div>
                <BoardView board={this.state.board}
                           boardMoves={moves}
                           getMove={this.makeMove.bind(this)}
                           pass={this.skipTurn.bind(this)}
                 />
                {this.renderScore()}
            </div>
        );
    }
}

export default GameManagerView