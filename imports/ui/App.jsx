import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

// Components
import Alert from 'react-s-alert';
import NavHeader from './components/NavHeader.jsx';
import NavFooter from './components/NavFooter.jsx';
import Footer from './components/Footer.jsx';

// Database Model
import '../api/users/index.js';

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
        <Alert
          stack={{ limit: 3 }}
          position="top"
          effect="stackslide"
          timeout={2000}
        />
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
