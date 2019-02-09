import React from 'react';
import Square from './Square';
import { moveKnight, canMoveKnight } from './observe';
import { ItemsTypes } from './Constants';
import { DropTarget } from 'react-dnd';

const squareTarget = {
  drop(props) {
    moveKnight(props.x, props.y);
  },
  canDrop(props) {
    return canMoveKnight(props.x, props.y);
  }
}

function collect(connector, monitor) {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }
}

function renderOverlay(color) {
  return (
    <div
      style={
        {
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: 0.5,
          backgroundColor: color,
        }
      }
    ></div>
  )
}
function BoardSquare({ x, y, connectDropTarget, isOver, canDrop, children }) {
  const black = (x + y) % 2 === 1;
  return (connectDropTarget(
    <div
      style={
        {
          position: 'relative',
          width: '100%',
          height: '100%',
        }
      }
    >
      <Square
        black={black}
      >
        {children}
      </Square>
      {isOver && !canDrop && renderOverlay('red')}
      {!isOver && canDrop && renderOverlay('yellow')}
      {isOver && canDrop && renderOverlay('green')}
    </div>)
  )
}

export default DropTarget(ItemsTypes.KNIGHT, squareTarget, collect)(BoardSquare);

