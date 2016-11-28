import React, { Component, PropTypes } from 'react';

import NavHeader from '../components/NavHeader.jsx';

export default class Constructing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location: 'constructing',
    };
  }

  render() {
    const { User } = this.props;
    return (
      <div className="container">
        <NavHeader User={User} location={this.state.location} primary />
        <div className="content">
          <div className="recap">
            <h1 className="recap-title">页面建设中</h1>
            <p className="recap-detail recap-detail-1">Under Constructing</p>
            <p className="recap-detail recap-detail-2">Created By Simon Lee</p>
          </div>
        </div>
      </div>
    );
  }

}

Constructing.propTypes = {
  User: PropTypes.object,
};
