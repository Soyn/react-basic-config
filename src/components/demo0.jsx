import React, { Component } from 'react';
import { connect } from 'react-redux'
import { height } from 'window-size';
export const countReducer = (state = {}, action) => {
  switch (action.type) {
    case 'INCREASE_1':
      return {
        ...state,
        demo_1: {
          count: state.demo_1.count + 1,
        }
      };
    case 'INCREASE_2':
      return {
        ...state,
        demo_2: {
          count: state.demo_2.count + 1,
        }
      }
    default:
      return {
        ...state,
        demo_1: {
          count: 0,
        },
        demo_2: {
          count: 0,
        }

      }
  }
}
export const increase_1 = () => ({
  type: 'INCREASE_1',
});
export const increase_2 = () => ({
  type: 'INCREASE_2',
});

const mapStateToProps1 = (state, props) => {
  // const demo1 = Object.assign({}, state.demo_1);
  const demo1 = state.demo_1;
  return {
    demoData: demo1,
  }
}
const mapStateToProps2 = (state, props) => {
  const demo2 = state.demo_2;
  return {
    demoData: demo2,
  }
}
class CardView1 extends Component {
  render() {
    console.log('...render cardview1');
    return (<div className="card" style={{
      backgroundColor: 'red',
      width: '150px',
      height: '50px',
      display: 'inline-block',
      color: 'white',
    }}>{`Cardview1 CurrentView: ${this.props.demoData.count}`}</div>);
  }
}
class CardView2 extends Component {
  render() {
    console.log('...render cardview2');
    return (<div className="card"style={{
      backgroundColor: 'blue',
      width: '150px',
      height: '50px',
      display: 'inline-block',
      marginLeft: '10px',
      color: 'white',
    }}>{`Cardview2 CurrentView: ${this.props.demoData.count}`}</div>);
  }
}
const connected = {
  CardView1: connect(mapStateToProps1)(CardView1),
  CardView2: connect(mapStateToProps2)(CardView2),
}

class Counter extends Component {
  render() {
    return (
      <div id="app-container" style={{
        textAlign: 'center',
      }}>
        <h1>
          <button className="count1" onClick={() => {
            this.props.dispatch(increase_1());
          }}>Increase Card 1</button>
          <button className="count2" onClick={() => {
            this.props.dispatch(increase_2());
          }}>Increase Card 2</button>
        </h1>
        <connected.CardView1/>
        <connected.CardView2/>
      </div>
    );
  }
}
export default connect()(Counter);
