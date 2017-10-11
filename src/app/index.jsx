import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import ItemList   from './components/ItemList';

const store = configureStore();

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <ItemList />
      </div>
    </Provider>
  );
}

render(<App />, document.getElementById('root'));