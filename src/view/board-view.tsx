import React from "react";
import {Button, Grid} from "@material-ui/core";
import "./tile-view.css"
import {Board} from "../othello/board";
import TileView from "./tile-view";
import {Move} from "../othello/move";

interface BoardProps {
    board: Board
    boardMoves: Move[]
    getMove: (row: number, col: number) => void
    pass: () => void
}
class BoardView extends React.Component<BoardProps> {
    getTiles() {
        const tileViews = []
        const tiles = this.props.board.board;
        for(let rowIndex = 0; rowIndex < tiles.length; rowIndex++) {
            const row = tiles[rowIndex]
            const curRowTiles = []
            for(let colIndex = 0; colIndex < row.length; colIndex++) {
                const tile = row[colIndex];
                let tileView = undefined;
                if (this.isMoveTile(rowIndex, colIndex)) {
                    tileView = <TileView key={rowIndex + " " + colIndex} tokenColor={tile} isSelectableTile={true} onClick={() => this.props.getMove(rowIndex, colIndex)}/>
                } else {
                    tileView = <TileView key={rowIndex + " " + colIndex} tokenColor={tile} isSelectableTile={false} onClick={undefined}/>
                }

                curRowTiles.push(tileView)
            }
            tileViews.push(<Grid key={rowIndex} item>
                {curRowTiles}
            </Grid>)
        }
        return tileViews
    }

    isMoveTile(row: number, col: number) {
        const moves = this.props.boardMoves.filter(move => move.position.row === row && move.position.column === col);
        return moves.length > 0
    }


    render() {
        const isPassTurn = this.props.boardMoves.length === 0
        return (
            <div>
                <Grid container justify="center" wrap={"nowrap"}>
                    {this.getTiles()}
                </Grid>
                {isPassTurn && !this.props.board.isGameOver() && <Button variant="contained" color="primary" onClick={this.props.pass}>
                  Skip
                </Button>}
            </div>
        );
    }
}

export default BoardView