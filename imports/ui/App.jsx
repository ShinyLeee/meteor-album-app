import React, { Component, PropTypes } from 'react';
import Alert from 'react-s-alert';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import CircularProgress from 'material-ui/CircularProgress';
import NavHeader from './components/NavHeader.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      location: 'index',
    });
  }

  render() {
    const { userIsReady, User } = this.props;
    if (!userIsReady) {
      return (
        <div className="container">
          <NavHeader
            User={User}
            location={this.state.location}
          />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }
    return (
      <div>
        <Alert
          stack={{ limit: 3 }}
          position="top"
          effect="stackslide"
          timeout={3000}
        />
        { React.cloneElement(this.props.children, { User }) }
      </div>
    );
  }

}

App.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
};

export default createContainer(() => {
  let userIsReady;
  const User = Meteor.user();
  if (typeof User === 'undefined' || User) userIsReady = !!User;
  else userIsReady = true;
  return {
    User,
    userIsReady,
  };
}, App);
