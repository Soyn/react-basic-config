import { createStore } from 'redux';
import { strictEqual } from 'assert';

const INCREASE_COUNTER = 'INCREASE_COUNTER';
const DECREASE_COUNTER = 'DECREASE_COUNTER';
const RESET_COUNTER = 'RESET_COUNTER';

const initState = {
  currentCounter: 0,
};
export const increaseCounter = () => ({
  type: INCREASE_COUNTER,
});

export const decreaseCounter = () => ({
  type: DECREASE_COUNTER,
});
export const resetCounter = () => ({
  type: RESET_COUNTER,
});
const counterReducer = (state, action) => {
  switch(action.type) {
    case INCREASE_COUNTER: {
      return {
        currentCounter: state.currentCounter + 1,
      };
    }
    case DECREASE_COUNTER: {
      return {
        currentCounter: state.currentCounter - 1,
      };
    }
    case RESET_COUNTER: {
      return {
        currentCounter: 0,
      };
    }
    default: {
      return initState;
    }
  }
}

export const counterStore = createStore(counterReducer);
