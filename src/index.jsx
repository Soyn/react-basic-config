import React, { Component } from 'react';
import {render} from 'react-dom';
import Counter, { countReducer } from './components/demo0';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
const store = createStore(countReducer);

class App extends Component {
  render() {
    console.log(store.getState());
    return (
      <Provider store={store}>
        <div id="demos-container">
          <Counter />
        </div>
      </Provider>
    )
  }
}
render(<App />, document.getElementById('root'));