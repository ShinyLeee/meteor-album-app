import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'index',
      authenticated: true,
    };
  }

  render() {
    return (
      <div className="nav-header">
        <Link to="/publish" className="nav-header-submit pull-left">
          发布图片
        </Link>
        <Link to="/" className="nav-header-logo">
          <img src="/img/logo.png" alt="logo" />
        </Link>
        <Link to="/user" className="nav-header-user pull-right">
          <img src="/img/extra-large.jpg" alt="avatar" />
        </Link>
      </div>
    );
  }

}
