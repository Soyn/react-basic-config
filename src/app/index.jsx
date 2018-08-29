import React, { Component } from 'react';
import {render} from 'react-dom';
import { Tabs , TabPanel } from './02';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({
      activeIndex: parseInt(e.target.value, 10),
    });
  }

  render() {
    return(
      <div>
        <div className="operator">
          <span>切换 Tab: </span>
          <select value={this.state.activeIndex} onChange={this.handleChange}>
            <option value="0">Tab 1</option>
            <option value="1">Tab 2</option>
            <option value="2">Tab 3</option>
          </select>
        </div>

        <Tabs defaultActiveIndex={this.state.activeIndex} className="tabs-bar">
          <TabPanel order="0" tab="Tab 1">第一个Tab里的内容</TabPanel>
          <TabPanel order="1" tab="Tab 2">第二个Tab里的内容</TabPanel>
          <TabPanel order="2" tab="Tab 3">第三个Tab里的内容</TabPanel>
        </Tabs>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));