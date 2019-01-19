import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Counter from './demos/reactReduxDemo/counter';
import { counterStore } from './demos/reactReduxDemo/configStore';

class App extends Component {
  render() {
    return(
      <Provider store={counterStore}>
        <Counter />
      </Provider>
    );
  }
}
render(<App />, document.getElementById('root'));
