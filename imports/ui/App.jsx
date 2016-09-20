import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import NavHeader from './partial/NavHeader.jsx';
import NavFooter from './partial/NavFooter.jsx';
import Footer from './partial/Footer.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
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

App.defaultProps = {
  user: Meteor.user() || null, // TODO -> fix issue
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};
