import React from 'react';

import BoardSquare from './BoardSquare';
import Knight from './Knight';


function renderSquare(i, knightPosition) {
  const x = i % 8;
  const y = Math.floor(i / 8);
  return (
    <div
      key={i}
      style={{
        width: '12.5%',
        height: '12.5%',
      }}
    >
      <BoardSquare x={x} y={y}>
        {renderPieces(x, y, knightPosition)}
      </BoardSquare>
    </div>
  )
}

function renderPieces(x, y, [knightX, knightY]) {
  if (x === knightX && y === knightY) {
    return <Knight />
  }
}
export default function Board({ knightPosition }) {
  const squares = [];
  for (let i = 0; i < 64; i += 1) {
    squares.push(renderSquare(i, knightPosition));
  }
  return (
    // <DragDropContextProvider backend={HTML5Backend}>
      <div
        style={{
          width: '500px',
          height: '500px',
          display: 'flex',
          flexWrap: 'wrap',
          border: '1px solid',
        }}
      >
        {squares}
      </div>
    // </DragDropContextProvider>
  );
}