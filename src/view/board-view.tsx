import React from "react";
import {PlayerColor} from "../othello/player/player-color";
import {Grid, GridList, GridListTile, Icon} from "@material-ui/core";
import {Tile} from "../othello/tile";
import "./tile-view.css"
import GameManager from "../othello/game-manager";
import {Board} from "../othello/board";
import TileView from "./tile-view";

interface BoardProps {
    board: Board
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
                const tileView = <TileView tokenColor={tile}/>
                curRowTiles.push(tileView)
            }
            tileViews.push(<Grid  item spacing={0}>
                {curRowTiles}
            </Grid>)
        }
        return tileViews
    }


    render() {
        return (
            <Grid container justify="center" wrap={"nowrap"}>
                {this.getTiles()}
            </Grid>
        );
    }
}

export default BoardView