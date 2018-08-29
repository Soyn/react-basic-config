import React, { Component,  } from 'react';
import PropTypes from 'prop-types';
import styles from './style.scss';
import TabNav from './TabNav';
import TabContent from './TabContent';
import classnames from 'classnames';

class Tabs extends Component {
  static propTypes = {
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    defaultActiveIndex: PropTypes.number,
    activeIndex: PropTypes.number,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    classPrefix: 'tabs',
    onChange: () => {},
  };

  constructor(props) {
    super(props);
    const currentProps = this.props;
    let activeIndex = 0;

    if ('activeIndex' in currentProps) {
      activeIndex = currentProps.activeIndex;
    } else if ('defaultActiveIndex' in currentProps) {
      activeIndex = currentProps.defaultActiveIndex;
    }
    this.state = {
      activeIndex: activeIndex,
      prevIndex: activeIndex,
    }

    this.handleTabClick = this.handleTabClick.bind(this);
    this.renderTabContent = this.renderTabContent.bind(this);
    this.renderTabNav = this.renderTabNav.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if('activeIndex' in nextProps) {
      this.setState({
        activeIndex: nextProps.activeIndex,
      });
    }
  }
  handleTabClick(activeIndex) {
    const prevIndex = this.state.activeIndex;

    if(this.state.activeIndex !== activeIndex &&
      'defaultActiveIndex' in this.props) {
        this.setState({
          activeIndex,
          prevIndex,
        });
      this.props.onChange({ activeIndex, prevIndex });
      }
  }

  renderTabNav() {
    const { classPrefix,  children } = this.props;

    return (
      <TabNav
        key='tabBar'
        classPrefix={classPrefix}
        onTabClick={this.handleTabClick}
        panels={children}
        activeIndex={this.state.activeIndex}
      />
    )
  }

  renderTabContent() {
    const { classPrefix, children } = this.props;
    
    return (
      <TabContent
        key="tabContent"
        classPrefix={classPrefix}
        activeIndex={this.state.activeIndex}
        panels={children}
        />
    );
  }
  render() {
    const { className } = this.props;
    const cx = classnames(className, 'ui-tabs');

    return(
      <div className={cx}>
        {this.renderTabNav()}
        {this.renderTabContent()}
      </div>
    )
  }
}
export default Tabs;