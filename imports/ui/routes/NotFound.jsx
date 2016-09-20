import React, { Component } from 'react';

export default class NotFound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'NotFound',
    };
  }

  render() {
    return (
      <div className="content">
        <div className="recap">
          <h1 className="recap-title">404 Not Found</h1>
          <p className="recap-detail recap-detail-1">该页面不存在</p>
          <p className="recap-detail recap-detail-2">Created By Simon Lee</p>
        </div>
      </div>
    );
  }

}
