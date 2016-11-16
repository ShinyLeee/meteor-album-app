import React, { Component, PropTypes } from 'react';

import NavHeader from '../components/NavHeader.jsx';

export default class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'notfound',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
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
};
