import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Alert from 'react-s-alert';

import '/imports/api/users/user.js';

import defaultUser from './lib/defaultUser.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  render() {
    return (
      <div>
        <Alert
          stack={{ limit: 3 }}
          position="top"
          effect="stackslide"
          timeout={3000}
        />
        {this.props.children}
      </div>
    );
  }

}

App.propTypes = {
  User: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

const mapStateToProps = (state) => ({
  User: state.user || defaultUser,
});

export default connect(mapStateToProps)(App);
