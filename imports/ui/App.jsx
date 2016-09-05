import React, { Component } from 'react';

import NavHeader from './partial/NavHeader.jsx';
import NavFooter from './partial/NavFooter.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isClick: false,
    };
  }

  render() {
    return (
      <div className="container">
        <NavHeader />
        {this.props.children}
        <NavFooter />
      </div>
    );
  }

}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};

// export default createContainer(() => {
// }, App);
