import React from 'react';
import './App.css';
import BoardView from "./view/board-view";
import {Board} from "./othello/board";
import GameManagerView from "./view/game-manager-view";
import {MinimaxPlayer} from "./othello/player/minimax-player";
import {PlayerColor} from "./othello/player/player-color";
import {
    mobilityEvaluationFunction,
    scoreEvaluationFunction
} from "./othello/player/evaluation-functions/evaluation-functions";
import GameManager from "./othello/game-manager";

function App() {

  return (

    <div className="App">
        <GameManagerView/>
    </div>
  );
}

export default App;
