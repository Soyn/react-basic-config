import React, { Component } from 'react';
import {render} from 'react-dom';
import { Tabs , TabPanel, QrCode } from './app/02';
import { BootStrapButton } from './components/Button';
import { BootstrapAlert } from './components/Alert';
import { BootstrapBadge } from './components/Badge';
import { BootstrapBreadcrumb } from './components/Breadcrumb';
import { BootstrapButtonGroup } from './components/ButtonGroup';
import { BootstrapCard } from './components/Card';
import { BootstrapCarousel } from './components/Carousel';
class TabsDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
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

class App extends Component {
  render() {
    return (
      <div id="demos-container">
        <BootStrapButton />
        <BootstrapAlert />
        <BootstrapBadge />
        <BootstrapBreadcrumb />
        <BootstrapButtonGroup />
        <BootstrapCard />
        <BootstrapCarousel />
      </div>
    )
  }
}
render(<App />, document.getElementById('root'));