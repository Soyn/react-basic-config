import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';

class Item extends Component {
  render() {
    const { number } = this.props;
    return <span className="item">{number}</span>
  }
}
class List extends Component {
  render() {
    const { numbers } = this.props;
    return (<div className="list-container">{
      numbers.map(number => {
        return <Item number={number} key={number} />
      })
    }</div>);
  }
}
class App extends Component {
  state = {
    numbers: [1, 2, 3],
  }
  onClickHandler = () => {
    this.setState((state) => {
      if (!isFinite(Math.pow(state.numbers[1], 2)) || !isFinite(Math.pow(state.numbers[2], 2))) {
        return {
          numbers: [1, 2, 3],
        }
      }
      return {
        numbers: state.numbers.map(n => n * n),
      };
    })
  }
  render() {
    return <div className="app">
      <button onClick={this.onClickHandler}>Click Me</button>
      <List numbers={this.state.numbers} />
    </div>
  }
}

render(<App />, document.getElementById('root'));