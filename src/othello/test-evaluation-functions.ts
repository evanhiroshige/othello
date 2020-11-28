import GameManager from "./game-manager";
import {MinimaxPlayer} from "./player/minimax-player";
import {PlayerColor} from "./player/player-color";
import {
    mobilityEvaluationFunction,
    stableEdgeEvaluationFunction
} from "./player/evaluation-functions/evaluation-functions";

export const runTest = async () => {
    const whitePlayer = new MinimaxPlayer(PlayerColor.WHITE, 2, mobilityEvaluationFunction)
    const blackPlayer = new MinimaxPlayer(PlayerColor.BLACK, 2, stableEdgeEvaluationFunction)
    const gm = new GameManager(whitePlayer, blackPlayer)
    await gm.startGame()
}
