import React, { Component } from 'react';
import qrImage from './qr.jpg'
import styles from './style.scss'
class QRCode extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickQr = this.handleClickQr.bind(this);

    this.state = {
      active: false,
    }
  }

  componentDidMount() {
    document.body.addEventListener('click', e => {
      if (e.target.matches('button.qr')) {
        return ;
      }
        this.setState({
          active: false,
        })
    });

    document.querySelector('.code').addEventListener('click', e => {
      e.stopPropagation();
    });
  }

  componentWillUnmount() {
    document.body.removeEventListener('click');
  }

  handleClick() {
    this.setState({
      active: !this.state.active,
    })
  }

  handleClickQr(e) {
    e.stopPropagation();
  }

  render() {
    return(
      <div className="qr-wrapper"
      >
        <button className="qr"
          onClick={this.handleClick}
        >QRCode</button>
        <div
          className="code"
          style={{
            display: this.state.active ? 'block' : 'none'
          }}
        >
          <img src={qrImage} />
        </div>
      </div>
    )
  }
}

export default QRCode;