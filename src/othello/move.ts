import Posn from "./utility/posn";
import {Tile} from "./tile";

export interface Move {
    position: Posn,
    tile: Tile
}
