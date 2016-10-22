import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CircularProgress from 'material-ui/CircularProgress';

import NavHeader from '../components/NavHeader.jsx';

class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'notfound',
    };
  }

  render() {
    const { User, userIsReady } = this.props;
    if (!userIsReady) {
      return (
        <div className="container">
          <NavHeader location={this.state.location} />
          <div className="content text-center">
            <CircularProgress style={{ top: '150px' }} size={1} />
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <NavHeader
          User={User}
          location={this.state.location}
        />
        <div className="content">
          <div className="recap">
            <h1 className="recap-title">404 Not Found</h1>
            <p className="recap-detail recap-detail-1">该页面不存在</p>
            <p className="recap-detail recap-detail-2">Created By Simon Lee</p>
          </div>
        </div>
      </div>
    );
  }

}

NotFound.propTypes = {
  User: PropTypes.object,
  userIsReady: PropTypes.bool.isRequired,
};

export default createContainer(() => {
  const User = Meteor.user();
  const userIsReady = !!User;
  return {
    userIsReady,
    User,
  };
}, NotFound);
