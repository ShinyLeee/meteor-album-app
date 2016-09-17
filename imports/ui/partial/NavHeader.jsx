import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NavHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: 'NavHeader',
    };
  }

  render() {
    return (
      <div className="nav-header">
        <Link to="/upload" className="nav-header-submit pull-left">
          发布图片
        </Link>
        <Link to="/" className="nav-header-logo">
          <img src="http://o97tuh0p2.bkt.clouddn.com/vivian/assets/logo.png" alt="logo" />
        </Link>
        <Link to="/user" className="nav-header-user pull-right">
          <img src="http://o97tuh0p2.bkt.clouddn.com/vivian/assets/extra-large.jpg" alt="avatar" />
        </Link>
      </div>
    );
  }

}
