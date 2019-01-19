import React, { PureComponent } from 'react';
import { connect, Provider } from 'react-redux';
import { counterStore, increaseCounter, decreaseCounter, resetCounter } from './configStore';

import './style.scss';

class CardView extends PureComponent {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    content: 0,
  };
  render() {
    return(<div className="card-view">
    {this.props.content}
    </div>);
  }
}

class CounterButton extends PureComponent {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    content: 'Empty Content',
    action: () => {},
  };
  render() {
    return (
      <div className="button-counter" onClick={this.props.action}>{this.props.content}</div>
    );
  }
}

export class Counter extends PureComponent {
  render() {
    return (
      <div className="counter-container">
        <div className="control-container">
          <CounterButton className="increase-counter" content="Increase" action={this.props.increase} />
          <CounterButton className="reset-counter" content="Reset" action={this.props.reset} />
          <CounterButton className="descrease-counter" content="Decrease" action={this.props.descrease} />
        </div>
        <CardView content={this.props.count}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currentCounter = state.currentCounter;
  return {
    count: currentCounter,
  }
};

const mapDispatchToProps = (dispacth) => {
  return {
    increase: () => dispacth(increaseCounter()),
    descrease: () => dispacth(decreaseCounter()),
    reset: () => dispacth(resetCounter()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
