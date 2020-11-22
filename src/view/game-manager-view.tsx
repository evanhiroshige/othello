import React from "react";
import "./tile-view.css"
import GameManager from "../othello/game-manager";
import BoardView from "./board-view";
import {Board} from "../othello/board";
import {MinimaxPlayer} from "../othello/player/minimax-player";
import {PlayerColor} from "../othello/player/player-color";
import {
    mobilityEvaluationFunction, scoreEvaluationFunction
} from "../othello/player/evaluation-functions/evaluation-functions";

interface GameManagerProps {
}

interface GameManagerState {
    board: Board,
}

class GameManagerView extends React.Component<GameManagerProps, GameManagerState> {
    private manager: GameManager
    state: GameManagerState = {
        board: undefined
    }

    constructor(props: GameManagerProps) {
        super(props);
        const w = new MinimaxPlayer(PlayerColor.WHITE, 2, mobilityEvaluationFunction)
        const b = new MinimaxPlayer(PlayerColor.BLACK, 2, scoreEvaluationFunction)
        this.manager = new GameManager(w,b, this.onTurn.bind(this))
        this.state.board = this.manager.board
        this.manager.startGame()
    }

    onTurn() {
        this.setState({board: this.manager.board})
        if (this.manager.board.isGameOver()) {
            this.manager.resetGame()
            this.manager.startGame()
        }
    }

    renderScore() {
        // const score = "White: " + this.manager.whiteTurns
        //     + "   Black: " + this.manager.blackTurns
        const score = "White: " + this.manager.board.getScore(PlayerColor.WHITE)
            + "   Black: " + this.manager.board.getScore(PlayerColor.BLACK)
        return <div>{score}</div>
    }

    render() {

        return (
            <div>
                <BoardView board={this.state.board}/>
                {this.renderScore()}
            </div>
        );
    }
}

export default GameManagerView