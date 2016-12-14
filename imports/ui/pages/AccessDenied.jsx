import React, { Component, PropTypes } from 'react';

import NavHeader from '../components/NavHeader.jsx';

export default class AccessDenied extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'AccessDenied',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <div className="recap">
            <h1 className="recap-title">403 Access Denied</h1>
            <p className="recap-detail recap-detail-1">超出访问权限</p>
            <p className="recap-detail recap-detail-2">Created By Simon Lee</p>
          </div>
        </div>
      </div>
    );
  }

}

AccessDenied.propTypes = {
  User: PropTypes.object,
};
