import React from "react";
import {Tile} from "../othello/tile";
import "./tile-view.css"



export enum TileColor {
    WHITE_HEX= "#FFFFFF",
}

const GREEN_HEX = "#197419"
const LIGHT_GREEN_HEX = "#65A765"


interface TileProps {
    tokenColor: Tile;
    isSelectableTile: boolean;
    onClick: () => void;
}
class TileView extends React.Component<TileProps> {

    render() {
        const tokenColor = this.props.tokenColor === Tile.WHITE ? "#FFFFFF" : "#000000"
        return (
            <div className="square"
                 style={{background: this.props.isSelectableTile ? LIGHT_GREEN_HEX : GREEN_HEX}}
                 onClick={this.props.onClick}>
                {this.props.tokenColor !== Tile.UNOCCUPIED &&
                <div className="circle" style={{background: tokenColor}}/>}
            </div>

    );
    }
}

export default TileView