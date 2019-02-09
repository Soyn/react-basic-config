let knightPosition = [0, 0];
let observe = null;

function emitChange() {
  observe(knightPosition);
}

export function observe(o) {
  if (observe) {
    throw new Error('Multiple observers not implemented.')
  }
  observe = o;
  emitChange();
}

export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition;
  const dx = Math.abs(toX - x);
  const dy = Math.abs(toY - y);

  return dx === 2 && dy == 1 || dx == 1 && dy === 2;
}
export function moveKnight(toX, toY) {
  knightPosition = [toX, toY];
  emitChange();
}