import React, { Component } from 'react';

import NavHeader from './partial/NavHeader.jsx';
import NavFooter from './partial/NavFooter.jsx';
import Footer from './partial/Footer.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'App',
      authenticated: true,
    };
  }

  render() {
    return (
      <div
        className="container"
        children={this.props.children}
      >
        <NavHeader />
        {this.props.children}
        <Footer />
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
