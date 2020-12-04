import Posn from "./utility/posn";
import {Tile} from "./tile";
import {PlayerColor} from "./player/player-color";
import {Move} from "./move";
import {Direction} from "./utility/direction";

export class Board {
    board: Tile[][]
    blackTiles: Set<Posn>
    whiteTiles: Set<Posn>

    constructor(board: Tile[][] = undefined, blackTiles: Set<Posn> = undefined, whiteTiles: Set<Posn> = undefined) {
        if (board) {
            this.board = board
            this.blackTiles = blackTiles
            this.whiteTiles = whiteTiles
            return;
        }
        this.board = new Array(8)

        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8).fill(Tile.UNOCCUPIED)
        }
        this.board[3][3] = Tile.WHITE
        this.board[4][4] = Tile.WHITE
        this.board[3][4] = Tile.BLACK
        this.board[4][3] = Tile.BLACK
        this.blackTiles = new Set<Posn>()
        this.blackTiles.add({column: 3, row:4})
        this.blackTiles.add({column: 4, row:3})
        this.whiteTiles = new Set<Posn>()
        this.whiteTiles.add({column: 3, row:3})
        this.whiteTiles.add({column: 4, row:4})
    }

    public isGameOver() {
        const noTiles = this.whiteTiles.size === 0 || this.blackTiles.size === 0
        const noMoves = this.getLegalMoves(PlayerColor.BLACK).concat(this.getLegalMoves(PlayerColor.WHITE)).length === 0
        // console.log(noTiles, noMoves, this.whiteTiles.size + this.blackTiles.size === 64)
        return noTiles || noMoves || this.whiteTiles.size + this.blackTiles.size === 64
    }

    public getScore(color: PlayerColor): number {
        return color === PlayerColor.WHITE ? this.whiteTiles.size : this.blackTiles.size
    }

    public makeMove(move: Move) {
        this.setTile(move.position, move.tile)
    }

    public getLegalMoves(color: PlayerColor): Move[] {
        const curPlayerTilePosns = color === PlayerColor.WHITE ? this.whiteTiles : this.blackTiles
        let moves = []
        let seenMoves = new Map<number, Set<number>>()

        for(const position of Array.from(curPlayerTilePosns.values())) {
            const possibleMoves = this.getMovesFrom(position, color)
            for (const m of Array.from(possibleMoves)) {
                if (!seenMoves.get(m.row)) {
                    seenMoves.set(m.row, new Set<number>())
                }
                const seenColOnRow = seenMoves.get(m.row)
                if(!seenColOnRow.has(m.column)) {
                    seenColOnRow.add(m.column)
                    moves.push(m)
                }
            }
        }

        const tile = color === PlayerColor.WHITE ? Tile.WHITE: Tile.BLACK
        moves = moves.map(m => {
                return {position: m, tile: tile}
            })
        return moves
    }

    private isOccupied(position: Posn) {
        return this.board[position.row][position.column] !== Tile.UNOCCUPIED
    }

    private getMovesFrom(position: Posn, color: PlayerColor): Set<Posn> {
        const directions: Direction[] = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST,
            Direction.NORTHEAST, Direction.SOUTHEAST, Direction.SOUTHWEST, Direction.NORTHWEST]
        const moves = new Set<Posn>()
        for (let direction of directions) {
            let curPosn = position
            let lastColor = undefined
            while (this.isPosnOnBoard(curPosn) && this.isOccupied(curPosn)) {
                lastColor = this.board[curPosn.row][curPosn.column] === Tile.WHITE ? PlayerColor.WHITE : PlayerColor.BLACK
                switch (direction) {
                    case Direction.NORTH:
                        curPosn = {column: curPosn.column, row: curPosn.row - 1}
                        break
                    case Direction.EAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row}
                        break
                    case Direction.SOUTH:
                        curPosn = {column: curPosn.column, row: curPosn.row + 1}
                        break
                    case Direction.WEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row}
                        break
                    case Direction.NORTHEAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row - 1}
                        break
                    case Direction.SOUTHEAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row + 1}
                        break
                    case Direction.SOUTHWEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row + 1}
                        break
                    case Direction.NORTHWEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row - 1}
                        break
                }
            }

            if (lastColor !== color && this.isPosnOnBoard(curPosn)) {
                moves.add(curPosn)
            }
            curPosn = position
        }
        return moves
    }

    public isPosnOnBoard(position: Posn) {
        return position.column < this.board.length && position.column >= 0 && position.row < this.board.length && position.row >=0
    }

    public isPosnOccupied(position: Posn) {
        return this.board[position.row][position.column] !== Tile.UNOCCUPIED
    }

    public setTile(position: Posn, tile: Tile) {
        if (tile === Tile.UNOCCUPIED) {
            throw new Error("Cannot set tile to unoccupied")
        }
        this.board[position.row][position.column] = tile
        const curPlayerTilePosns = tile === Tile.WHITE? this.whiteTiles : this.blackTiles
        curPlayerTilePosns.add(position)
        this.flipTiles(position, tile)
    }

    private flipTiles(position: Posn, tile: Tile): void {
        const directions: Direction[] = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST,
            Direction.NORTHEAST, Direction.SOUTHEAST, Direction.SOUTHWEST, Direction.NORTHWEST]
        let posnsToFlip: Posn[] = []
        for (let direction of directions) {
            let curPosn = position
            let isFlank = false
            let accFlips: Posn[] = []
            while (this.isPosnOnBoard(curPosn) && this.isOccupied(curPosn)) {
                switch (direction) {
                    case Direction.NORTH:
                        curPosn = {column: curPosn.column, row: curPosn.row - 1}
                        break
                    case Direction.EAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row}
                        break
                    case Direction.SOUTH:
                        curPosn = {column: curPosn.column, row: curPosn.row + 1}
                        break
                    case Direction.WEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row}
                        break
                    case Direction.NORTHEAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row - 1}
                        break
                    case Direction.SOUTHEAST:
                        curPosn = {column: curPosn.column + 1, row: curPosn.row + 1}
                        break
                    case Direction.SOUTHWEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row + 1}
                        break
                    case Direction.NORTHWEST:
                        curPosn = {column: curPosn.column - 1, row: curPosn.row - 1}
                        break
                }
                if (!this.isPosnOnBoard(curPosn)) {
                    break
                }

                let curTile = this.board[curPosn.row][curPosn.column]
                if (curTile !== tile && curTile !== Tile.UNOCCUPIED) {
                    accFlips.push(curPosn)
                } else {
                    if (curTile !== Tile.UNOCCUPIED) {
                        isFlank = true
                    }
                    break
                }
            }

            if (isFlank) {
                posnsToFlip = posnsToFlip.concat(accFlips)
            }
        }

        for (let p of posnsToFlip) {
            this.board[p.row][p.column] = tile

            if(tile === Tile.BLACK) {
                this.blackTiles.add({row: p.row, column:p.column});
            } else {
                this.whiteTiles.add({row: p.row, column:p.column});
            }
        }
        const oppPlayerPosns = tile === Tile.WHITE ? this.blackTiles : this.whiteTiles
        for (const p of Array.from(oppPlayerPosns)) {
            for (const op of posnsToFlip) {
                if (op.column === p.column && op.row === p.row) {
                    oppPlayerPosns.delete(p)
                }
            }
        }
    }


    public copy() {
        return new Board(JSON.parse(JSON.stringify(this.board)), new Set(this.blackTiles), new Set(this.whiteTiles))
    }

    public toString() {
        let str = '   0 1 2 3 4 5 6 7\n'
        for(let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
            const row = this.board[rowIndex]
            for(let colIndex = 0; colIndex < row.length; colIndex++) {
                if (colIndex === 0) {
                    str += rowIndex + '  '
                }
                const tile = row[colIndex]
                switch(tile) {
                    case Tile.UNOCCUPIED:
                        str += '  '
                        break;
                    case Tile.BLACK:
                        str += 'B '
                        break;
                    case Tile.WHITE:
                        str += 'W '
                }
            }
            str += '\n'
        }
        return str
    }

    public toStringWithMoves(color: PlayerColor) {
        let str = ''
        const moves = this.getLegalMoves(color)
        for(let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
            const row = this.board[rowIndex]
            for(let colIndex = 0; colIndex < row.length; colIndex++) {
                const tile = row[colIndex]
                switch(tile) {
                    case Tile.UNOCCUPIED:
                        let seenMove = false
                        for (let i = 0; i < moves.length; i++) {
                            const move = moves[i].position
                            if (move.column === colIndex && move.row === rowIndex) {
                                str += i + ' '
                                seenMove = true
                                break
                            }
                        }
                        if (!seenMove) {
                            str += '+ '
                        }
                        break;
                    case Tile.BLACK:
                        str += 'B '
                        break;
                    case Tile.WHITE:
                        str += 'W '
                }
            }
            str += '\n'
        }
        return str
    }
}