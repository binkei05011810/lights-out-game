import React, { Component } from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true  when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {

  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25
  }

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
    this.createBoard = this.createBoard.bind(this);
    this.flipCellsAround = this.flipCellsAround.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    // Create array-of-arrays of true/false values
    for (let i = 0; i < this.props.nRows; i++) {
      let row = Array.from({ length: this.props.nCols }).map(ele => Math.random() < this.props.chanceLightStartsOn);
      board.push(row);
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { nCols, nRows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[y][x] = !board[y][x];
      }
    }

    // flip this cell and the cells around it
    flipCell(y, x);
    flipCell(y, x + 1);
    flipCell(y, x - 1);
    flipCell(y + 1, x);
    flipCell(y - 1, x);

    // Determine is the game has been won
    let hasWon = board.flat().every(ele => !ele);

    this.setState({ board, hasWon });
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    //Create the table
    let returnMessage;

    if (this.state.hasWon) {
      returnMessage =
        <div className="win-message">
          <div className="neon">You</div>
          <div className="flux">Win</div>
        </div>
    } else {
      returnMessage =
        <div className="Board">

          <div className="Board-title">
            <div className="neon">Lights</div>
            <div className="flux">Out</div>
          </div>

          <table className="Board-table">
            <tbody>
              {this.state.board.map((row, y) => {
                return <tr>{row.map((cell, x) => <Cell
                  isLit={cell}
                  key={`${y}-${x}`}
                  coordinate={`${y}-${x}`}
                  flipCellsAroundMe={this.flipCellsAround} />)}</tr>
              })}
            </tbody>
          </table>

        </div>
    }

    return returnMessage;
  }
}


export default Board;
