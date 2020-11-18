import React from "react";
import {PlayerColor} from "../othello/player/player-color";
import {Icon} from "@material-ui/core";
import {Tile} from "../othello/tile";
import "./tile-view.css"



export enum TileColor {
    WHITE_HEX= "#FFFFFF",
}

const GREEN_HEX = "#197419"


interface TileProps {
    tokenColor: Tile;
}
class TileView extends React.Component<TileProps> {
    render() {
        const tokenColor = this.props.tokenColor === Tile.WHITE ? "#FFFFFF" : "#000000"
        return (
            <div className="square" style={{background: GREEN_HEX}}>
                {this.props.tokenColor !== Tile.UNOCCUPIED &&
                <div className="circle" style={{background: tokenColor}}/>}
            </div>

    );
    }
}

export default TileView