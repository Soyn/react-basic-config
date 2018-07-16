import React from 'react';
import {render} from 'react-dom';
class PlaceHolder extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  onClick(evt) {
    console.log(evt);
  }

  render() {
    return(
      <div id="placeholder" onClick={this.onClick}>Click Me!</div>
    )
  }
}
const App = () => {
  return (
    <div id='container'>
      <PlaceHolder />
    </div>
  );
}

render(<App />, document.getElementById('root'));