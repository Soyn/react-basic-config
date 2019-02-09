import React, { Component } from 'react';
import Board from './Board';
import { render } from 'react-dom';
import { observe } from './observe';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const root = document.getElementById('root');
class ChessGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      knightPosition: [0, 0],
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(knightPosition) {
    this.setState({knightPosition})
  }

  componentDidMount() {
    observe(this.handleChange)
  }
  render() {
    return (
      <Board
        knightPosition={this.state.knightPosition}
      ></Board>
    )
  }
}

render(<DragDropContextProvider backend={HTML5Backend}><ChessGame /></DragDropContextProvider>, root);